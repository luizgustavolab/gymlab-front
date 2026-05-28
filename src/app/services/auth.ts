import { Injectable, signal } from '@angular/core';

import { Router } from '@angular/router';

import { supabase } from '../supabase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly carregando = signal(false);

  readonly usuario = signal<any | null>(null);

  constructor(
    private router: Router
  ) {
    this.recuperarSessao();
    this.observarAuth();
  }

  private async recuperarSessao(): Promise<void> {

    const {
      data,
      error
    } = await supabase.auth.getSession();

    if (error) {
      console.error('Erro ao recuperar sessão:', error.message);
      return;
    }

    this.usuario.set(
      data.session?.user ?? null
    );
  }

  private observarAuth(): void {

    supabase.auth.onAuthStateChange(
      (_event, session) => {

        this.usuario.set(
          session?.user ?? null
        );
      }
    );
  }

  async login(
    email: string,
    senha: string
  ): Promise<void> {

    try {

      this.carregando.set(true);

      const {
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password: senha
      });

      if (error) {
        throw error;
      }

      await this.router.navigate([
        '/dashboard'
      ]);

    } finally {

      this.carregando.set(false);
    }
  }

  async registrar(
    email: string,
    senha: string
  ): Promise<string | null> {

    try {

      this.carregando.set(true);

      const {
        data,
        error
      } = await supabase.auth.signUp({
        email,
        password: senha
      });

      if (error) {
        throw error;
      }

      return data.user?.id ?? null;

    } finally {

      this.carregando.set(false);
    }
  }

  async recuperarSenha(
    email: string
  ): Promise<void> {

    try {

      this.carregando.set(true);

      const {
        error
      } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo:
            'http://localhost:4200'
        }
      );

      if (error) {
        throw error;
      }

    } finally {

      this.carregando.set(false);
    }
  }

  async logout(): Promise<void> {

    await supabase.auth.signOut();

    this.usuario.set(null);

    await this.router.navigate([
      '/'
    ]);
  }

  autenticado(): boolean {

    return !!this.usuario();
  }

  obterToken(): Promise<string | null> {

    return supabase.auth
      .getSession()
      .then(({ data }) =>
        data.session?.access_token ?? null
      );
  }
}