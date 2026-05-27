import { Component, signal, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { supabase } from './supabase';

type ViewState =
  | 'CONSENT'
  | 'AUTH'
  | 'LOGIN'
  | 'RECOVER'
  | 'REGISTER'
  | 'CONFIG';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  private http = inject(HttpClient);

  // =========================================================
  // UI STATE
  // =========================================================

  protected view = signal<ViewState>('CONSENT');

  protected readonly exibirBanner = signal(
    !localStorage.getItem('gymlab_lgpd_consent')
  );

  protected carregando = signal(false);

  protected mensagemErro = signal<string | null>(null);

  protected mensagemSucesso = signal<string | null>(null);

  // =========================================================
  // DADOS DOS SELECTS
  // =========================================================

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

  // =========================================================
  // FORM LOGIN
  // =========================================================

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

  // =========================================================
  // FORM RECOVER
  // =========================================================

  protected formRecover = new FormGroup({
    email: new FormControl('', [
      Validators.required,
      Validators.email
    ])
  });

  // =========================================================
  // FORM CADASTRO
  // =========================================================

  protected formCadastro = new FormGroup({

    // AUTH
    nome: new FormControl('', [
      Validators.required,
      Validators.minLength(3)
    ]),

    email: new FormControl('', [
      Validators.required,
      Validators.email
    ]),

    senha: new FormControl('', [
      Validators.required,
      Validators.minLength(6)
    ]),

    // IA
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

  // =========================================================
  // INIT
  // =========================================================

  async ngOnInit() {

    // LGPD
    if (!this.exibirBanner()) {
      this.view.set('AUTH');
    }

    // Sessão ativa
    const {
      data: { session }
    } = await supabase.auth.getSession();

    if (session) {
      this.view.set('CONFIG');
    }
  }

  // =========================================================
  // NAVEGAÇÃO
  // =========================================================

  protected irPara(tela: ViewState) {

    this.mensagemErro.set(null);

    this.mensagemSucesso.set(null);

    this.view.set(tela);
  }

  // =========================================================
  // LGPD
  // =========================================================

  protected computarConsentimento(
    aceitou: boolean
  ): void {

    const log = {
      consentido: aceitou,
      dataHora: new Date().toISOString(),
      versaoTermo: '1.0'
    };

    localStorage.setItem(
      'gymlab_lgpd_consent',
      JSON.stringify(log)
    );

    console.log(
      'Consentimento registrado:',
      log
    );

    this.exibirBanner.set(false);

    this.view.set('AUTH');
  }

  // =========================================================
  // LOGIN
  // =========================================================

  protected async login() {

    if (this.formLogin.invalid) {
      return;
    }

    this.carregando.set(true);

    this.mensagemErro.set(null);

    this.mensagemSucesso.set(null);

    const email = this.formLogin.value.email!;
    const senha = this.formLogin.value.senha!;

    try {

      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password: senha
        });

      if (error) {

        this.mensagemErro.set(
          'E-mail ou senha inválidos.'
        );

        this.carregando.set(false);

        return;
      }

      this.mensagemSucesso.set(
        'Login realizado com sucesso.'
      );

      this.carregando.set(false);

      this.view.set('CONFIG');

    } catch (err) {

      console.error(err);

      this.mensagemErro.set(
        'Erro inesperado no login.'
      );

      this.carregando.set(false);
    }
  }

  // =========================================================
  // RECUPERAR SENHA
  // =========================================================

  protected async recuperarSenha() {

    if (this.formRecover.invalid) {
      return;
    }

    this.carregando.set(true);

    this.mensagemErro.set(null);

    this.mensagemSucesso.set(null);

    const email =
      this.formRecover.value.email!;

    try {

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email,
          {
            redirectTo:
              'http://localhost:4200'
          }
        );

      if (error) {

        this.mensagemErro.set(error.message);

        this.carregando.set(false);

        return;
      }

      this.mensagemSucesso.set(
        'E-mail de recuperação enviado.'
      );

      this.carregando.set(false);

    } catch (err) {

      console.error(err);

      this.mensagemErro.set(
        'Erro ao recuperar senha.'
      );

      this.carregando.set(false);
    }
  }

  // =========================================================
  // CADASTRO + IA
  // =========================================================

  protected async enviarCadastroUnificado() {

    if (this.formCadastro.invalid) {
      return;
    }

    this.carregando.set(true);

    this.mensagemErro.set(null);

    this.mensagemSucesso.set(null);

    const {
      email,
      senha,
      nome,
      ...dadosTreino
    } = this.formCadastro.value;

    try {

      // =====================================================
      // AUTH SUPABASE
      // =====================================================

      const {
        data,
        error
      } = await supabase.auth.signUp({

        email: email!,

        password: senha!,

        options: {
          data: {
            nome
          }
        }
      });

      if (error) {

        if (
          error.message
            .toLowerCase()
            .includes('already')
        ) {

          this.mensagemErro.set(
            'Este e-mail já está cadastrado.'
          );

        } else {

          this.mensagemErro.set(error.message);
        }

        this.carregando.set(false);

        return;
      }

      // =====================================================
      // CASO EXIJA CONFIRMAÇÃO DE EMAIL
      // =====================================================

      const session = data.session;

      if (!session?.access_token) {

        this.mensagemSucesso.set(
          'Conta criada. Verifique seu e-mail para confirmar o cadastro.'
        );

        this.carregando.set(false);

        this.view.set('LOGIN');

        return;
      }

      // =====================================================
      // TOKEN JWT
      // =====================================================

      const token =
        session.access_token;

      // =====================================================
      // BACKEND JAVA
      // =====================================================

      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`
      });

      this.http.post(
        'http://localhost:8080/api/treinos/gerar',
        dadosTreino,
        { headers }
      ).subscribe({

        next: () => {

          this.mensagemSucesso.set(
            'Conta criada e treino gerado.'
          );

          this.carregando.set(false);

          this.view.set('CONFIG');
        },

        error: (err) => {

          console.error(err);

          this.mensagemErro.set(
            'Conta criada, mas houve erro ao gerar treino.'
          );

          this.carregando.set(false);
        }
      });

    } catch (err) {

      console.error(err);

      this.mensagemErro.set(
        'Erro inesperado no cadastro.'
      );

      this.carregando.set(false);
    }
  }

  // =========================================================
  // LOGOUT
  // =========================================================

  protected async logout() {

    await supabase.auth.signOut();

    this.formLogin.reset();

    this.view.set('AUTH');
  }
}