import {
  Component,
  inject,
  OnInit,
  signal,
  ViewEncapsulation
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { TreinoService } from '../../services/treino';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { supabase } from '../../supabase';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AuthComponent implements OnInit {

  private router = inject(Router);
  private http = inject(HttpClient);
  private treinoService = inject(TreinoService);

  protected view = signal<'AUTH' | 'LOGIN' | 'REGISTER' | 'RECOVER'>('AUTH');

  protected carregando = signal(false);
  protected mensagemErro = signal<string | null>(null);
  protected mensagemSucesso = signal<string | null>(null);

  protected exibirBanner = signal<boolean | null>(null);

  protected opcoesGenero = ['MASCULINO', 'FEMININO'];

  protected opcoesObjetivo = [
    'Hipertrofia',
    'Emagrecimento',
    'Força',
    'Condicionamento'
  ];

  protected pesos = Array.from({ length: 131 }, (_, i) => i + 30);

  protected alturas = Array.from(
    { length: 111 },
    (_, i) => (1.30 + i * 0.01).toFixed(2)
  );

  protected formLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    salvarCredenciais: new FormControl(false),
    manterConectado: new FormControl(false)
  });

  protected formRecover = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  protected formCadastro = new FormGroup({
    nome: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    senha: new FormControl('', [Validators.required, Validators.minLength(6)]),
    genero: new FormControl('', [Validators.required]),
    peso: new FormControl('70', [Validators.required]),
    altura: new FormControl('1.70', [Validators.required]),
    objetivo: new FormControl('', [Validators.required]),
    diasPorSemana: new FormControl(3, [
      Validators.required,
      Validators.min(1),
      Validators.max(7)
    ])
  });

  ngOnInit(): void {

    // evita flash de renderização
    this.exibirBanner.set(null);

    queueMicrotask(() => {
      const consent = localStorage.getItem('gymlab_lgpd_consent');

      if (!consent) {
        this.exibirBanner.set(true);
        return;
      }

      try {
        const parsed = JSON.parse(consent);

        const valido =
          parsed?.versaoTermo === '1.0' &&
          typeof parsed?.consentido === 'boolean';

        this.exibirBanner.set(!valido);
      } catch {
        this.exibirBanner.set(true);
      }
    });

    const emailSalvo = localStorage.getItem('gymlab_email');
    const senhaSalva = localStorage.getItem('gymlab_senha');

    const manterConectado =
      localStorage.getItem('gymlab_manter_conectado') === 'true';

    if (emailSalvo && senhaSalva) {
      this.formLogin.patchValue({
        email: emailSalvo,
        senha: senhaSalva,
        salvarCredenciais: true,
        manterConectado
      });
    }

    if (manterConectado) {
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) {
          this.router.navigate(['/dashboard']);
        }
      });
    }
  }

  protected irPara(
    tela: 'AUTH' | 'LOGIN' | 'REGISTER' | 'RECOVER'
  ): void {
    this.mensagemErro.set(null);
    this.mensagemSucesso.set(null);
    this.view.set(tela);
  }

  protected computarConsentimento(aceitou: boolean): void {

    const payload = {
      consentido: aceitou,
      dataHora: new Date().toISOString(),
      versaoTermo: '1.0'
    };

    // evita duplicação de envio
    const alreadySent = localStorage.getItem('gymlab_lgpd_sent');

    localStorage.setItem(
      'gymlab_lgpd_consent',
      JSON.stringify(payload)
    );

    if (!alreadySent) {
      this.http.post(
        `${environment.apiUrl}/lgpd/consentimento`,
        payload
      ).subscribe({
        next: () => {
          localStorage.setItem('gymlab_lgpd_sent', 'true');
        },
        error: (err) => {
          console.error('Erro LGPD:', err);
        }
      });
    }

    queueMicrotask(() => {
      this.exibirBanner.set(false);
    });

    this.view.set('AUTH');
  }

  protected async login(): Promise<void> {
    if (this.formLogin.invalid) return;

    this.carregando.set(true);
    this.mensagemErro.set(null);
    this.mensagemSucesso.set(null);

    const {
      email,
      senha,
      salvarCredenciais,
      manterConectado
    } = this.formLogin.getRawValue();

    const { error } = await supabase.auth.signInWithPassword({
      email: email!,
      password: senha!
    });

    if (error) {
      this.mensagemErro.set('E-mail ou senha inválidos.');
      this.carregando.set(false);
      return;
    }

    if (salvarCredenciais) {
      localStorage.setItem('gymlab_email', email!);
      localStorage.setItem('gymlab_senha', senha!);
    } else {
      localStorage.removeItem('gymlab_email');
      localStorage.removeItem('gymlab_senha');
    }

    localStorage.setItem(
      'gymlab_manter_conectado',
      String(manterConectado)
    );

    this.carregando.set(false);
    this.router.navigate(['/dashboard']);
  }

  protected async recuperarSenha(): Promise<void> {
    if (this.formRecover.invalid) return;

    this.carregando.set(true);
    this.mensagemErro.set(null);
    this.mensagemSucesso.set(null);

    const email = this.formRecover.value.email!;

    const { error } = await supabase.auth
      .resetPasswordForEmail(email);

    if (error) {
      this.mensagemErro.set('Erro ao enviar recuperação.');
    } else {
      this.mensagemSucesso.set('E-mail de recuperação enviado.');
    }

    this.carregando.set(false);
  }

  protected async enviarCadastroUnificado(): Promise<void> {
    if (this.formCadastro.invalid) return;

    this.carregando.set(true);
    this.mensagemErro.set(null);
    this.mensagemSucesso.set(null);

    try {
      const {
        nome,
        email,
        senha,
        genero,
        peso,
        altura,
        objetivo,
        diasPorSemana
      } = this.formCadastro.getRawValue();

      const signUpResult = await supabase.auth.signUp({
        email: email!,
        password: senha!,
        options: { data: { nome } }
      });

      if (signUpResult.error) {
        this.mensagemErro.set('Erro ao criar conta.');
        this.carregando.set(false);
        return;
      }

      const accessToken = signUpResult.data.session?.access_token;

      if (!accessToken) {
        this.mensagemErro.set('Falha ao obter token.');
        this.carregando.set(false);
        return;
      }

      // Gera o treino inicial em segundo plano: o cadastro não fica
      // bloqueado esperando o backend (evita pagar o cold start aqui).
      this.treinoService.gerarTreino(
        {
          genero,
          peso,
          altura,
          objetivo,
          diasPorSemana
        },
        accessToken
      ).subscribe({
        error: (err) => {
          console.error('Erro ao gerar treino inicial:', err);
        }
      });

      this.carregando.set(false);
      this.router.navigate(['/dashboard']);

    } catch {
      this.mensagemErro.set('Erro inesperado.');
      this.carregando.set(false);
    }
  }
}