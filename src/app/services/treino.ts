import {
  inject,
  Injectable
} from '@angular/core';

import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';

import {
  from,
  switchMap,
  throwError
} from 'rxjs';

import { environment }
  from '../../environments/environment';

import { supabase }
  from '../supabase';

@Injectable({
  providedIn: 'root'
})
export class TreinoService {

  private http =
    inject(HttpClient);

  private apiUrl =
    environment.apiUrl;

  /**
   * =========================================
   * HEADERS COM JWT
   * =========================================
   */

  private obterHeaders() {

    return from(
      supabase.auth.getSession()
    ).pipe(

      switchMap(({ data, error }) => {

  if (error) {

    console.error(
      'Erro ao obter sessão:',
      error
    );

    return throwError(
      () => error
    );
  }

  console.log(
    'Sessão Supabase:',
    data.session
  );

  const token =
    data.session?.access_token;

  console.log(
    'JWT TOKEN:',
    token
  );

  if (!token) {

    console.error(
      'Token JWT não encontrado.'
    );

    return throwError(
      () => new Error(
        'Usuário não autenticado.'
      )
    );
  }

  const headers =
    new HttpHeaders({

      Authorization:
        `Bearer ${token}`,

      'Content-Type':
        'application/json'
    });

  return [headers];
})
    );
  }

  /**
   * =========================================
   * GERA TREINO IA
   * =========================================
   */

  gerarTreino(
    payload: unknown,
    tokenManual?: string
  ) {

    /**
     * Caso o token venha manualmente
     * do login/cadastro, evita race
     * condition do Supabase.
     */

    if (tokenManual) {

      const headers =
        new HttpHeaders({

          Authorization:
            `Bearer ${tokenManual}`,

          'Content-Type':
            'application/json'
        });

      return this.http.post(
        `${this.apiUrl}/treinos/gerar`,
        payload,
        { headers }
      );
    }

    /**
     * Fluxo padrão:
     * busca token da sessão
     */

    return this.obterHeaders().pipe(

      switchMap(headers =>

        this.http.post(
          `${this.apiUrl}/treinos/gerar`,
          payload,
          { headers }
        )
      )
    );
  }

  /**
   * =========================================
   * BUSCAR TREINO DO USUÁRIO
   * =========================================
   */

  buscarMeuTreino() {

    return this.obterHeaders().pipe(

      switchMap(headers =>

        this.http.get(
          `${this.apiUrl}/treinos/me`,
          { headers }
        )
      )
    );
  }
}