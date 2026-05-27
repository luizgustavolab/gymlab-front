import {
  Component,
  inject,
  OnInit,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { supabase } from '../../supabase';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {

  private router = inject(Router);
  private http = inject(HttpClient);

  protected view = signal<
    'AUTH' |
    'LOGIN' |
    'REGISTER' |
    'RECOVER'
  >('AUTH');

  protected carregando = signal(false);

  protected mensagemErro = signal<string | null>(null);

  protected mensagemSucesso = signal<string | null>(null);

  protected readonly exibirBanner = signal(
    !localStorage.getItem('gymlab_lgpd_consent')
  );

  protected opcoesGenero = [
    'MASCULINO',
    'FEMININO'
  ];

  protected opcoesObjetivo = [
    'Hipertrofia',
    'Emagrecimento',
    'Força',
    'Condicionamento'
  ];

  protected pesos = Array.from(
    { length: 131 },
    (_, i) => i + 30
  );

  protected alturas = Array.from(
    { length: 111 },
    (_, i) => (1.30 + i * 0.01).toFixed(2)
  );

  protected formLogin = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    senha: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ])
  });

  protected formRecover = new FormGroup({

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  protected formCadastro = new FormGroup({

    nome: new FormControl('', Validators.required),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    senha: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

    genero: new FormControl('', Validators.required),

    peso: new FormControl('70', Validators.required),

    altura: new FormControl('1.70', Validators.required),

    objetivo: new FormControl('', Validators.required),

    diasPorSemana: new FormControl(3, [
      Validators.required,
      Validators.min(1),
      Validators.max(7)
    ])
  });

  ngOnInit() {

    if (!this.exibirBanner()) {
      this.view.set('AUTH');
    }
  }

  protected irPara(
    tela:
      'AUTH' |
      'LOGIN' |
      'REGISTER' |
      'RECOVER'
  ) {

    this.mensagemErro.set(null);

    this.mensagemSucesso.set(null);

    this.view.set(tela);
  }

  protected computarConsentimento(
  aceitou: boolean
): void {

  const payload = {

    consentido: aceitou,

    dataHora: new Date().toISOString(),

    versaoTermo: '1.0'
  };

  localStorage.setItem(
    'gymlab_lgpd_consent',
    JSON.stringify(payload)
  );

  this.http.post(
    'http://localhost:8080/api/lgpd/consentimento',
    payload
  ).subscribe({

    next: () => {

      console.log(
        'Consentimento LGPD registrado.'
      );
    },

    error: (err) => {

      console.error(
        'Erro ao registrar consentimento:',
        err
      );
    }
  });

  this.exibirBanner.set(false);

  this.view.set('AUTH');
}

  protected async login() {

    if (this.formLogin.invalid) {
      return;
    }

    this.carregando.set(true);

    this.mensagemErro.set(null);

    const {
      email,
      senha
    } = this.formLogin.getRawValue();

    const {
      error
    } = await supabase.auth.signInWithPassword({

      email: email!,
      password: senha!
    });

    if (error) {

      this.mensagemErro.set(
        'Credenciais inválidas.'
      );

      this.carregando.set(false);

      return;
    }

    this.router.navigate(['/dashboard']);
  }

  protected async recuperarSenha() {

    if (this.formRecover.invalid) {
      return;
    }

    this.carregando.set(true);

    const email =
      this.formRecover.value.email!;

    const {
      error
    } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {

      this.mensagemErro.set(error.message);

    } else {

      this.mensagemSucesso.set(
        'E-mail de recuperação enviado.'
      );
    }

    this.carregando.set(false);
  }

  protected async enviarCadastroUnificado() {

    if (this.formCadastro.invalid) {
      return;
    }

    this.carregando.set(true);

    this.mensagemErro.set(null);

    const {
      email,
      senha,
      ...dadosPerfil
    } = this.formCadastro.getRawValue();

    const {
      data,
      error
    } = await supabase.auth.signUp({

      email: email!,
      password: senha!
    });

    if (error) {

      this.mensagemErro.set(
        error.message
      );

      this.carregando.set(false);

      return;
    }

    this.http.post(
      'http://localhost:8080/api/treinos/gerar',
      dadosPerfil
    ).subscribe({

      next: () => {

        this.router.navigate([
          '/dashboard'
        ]);
      },

      error: () => {

        this.mensagemErro.set(
          'Erro ao gerar treino.'
        );

        this.carregando.set(false);
      }
    });
  }
}