import { Injectable, inject } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { firstValueFrom } from 'rxjs';

import { environment } from '../../environments/environment';

import { AuthService } from './auth';

/* ===================================================== */
/* TYPES */
/* ===================================================== */

export interface Exercicio {

  id: string;

  nome: string;

  categoria: string;

  equipamento: string;

  instrucao: string;
}

export interface TreinoUsuario {

  id?: string;

  diaSemana: string;

  grupoMuscular: string;

  exercicio: Exercicio;

  series: number;

  repeticoes: number;

  intervalo: string;

  criadoEm?: string;

  concluido?: boolean;

  ultimoPeso?: number;

  expandido?: boolean;
}

export interface GeraTreinoPayload {

  genero: string;

  peso: number;

  altura: number;

  objetivo: string;

  diasPorSemana: number;

  feedbackAjuste?: string;
}

/* ===================================================== */
/* SERVICE */
/* ===================================================== */

@Injectable({
  providedIn: 'root'
})
export class TreinoService {

  private readonly http = inject(HttpClient);

  private readonly auth = inject(AuthService);

  private readonly api =
    environment.apiUrl;

  /* ===================================================== */
  /* TOKEN */
  /* ===================================================== */

  private async authHeaders() {

    const token =
      await this.auth.obterToken();

    return {
      Authorization:
        `Bearer ${token}`
    };
  }

  /* ===================================================== */
  /* EXERCÍCIOS */
  /* ===================================================== */

  async listarExercicios():
    Promise<Exercicio[]> {

    return firstValueFrom(

      this.http.get<Exercicio[]>(

        `${this.api}/exercicios`
      )
    );
  }

  /* ===================================================== */
  /* GERAR TREINO IA */
  /* ===================================================== */

  async gerarTreino(
    payload: GeraTreinoPayload
  ): Promise<TreinoUsuario[]> {

    const headers =
      await this.authHeaders();

    return firstValueFrom(

      this.http.post<TreinoUsuario[]>(

        `${this.api}/treinos/gerar`,
        payload,
        {
          headers
        }
      )
    );
  }

  /* ===================================================== */
  /* MOCK TEMPORÁRIO DASHBOARD */
  /* ===================================================== */

  treinoMockHoje(): TreinoUsuario[] {

    return [

      {
        diaSemana: 'Segunda',

        grupoMuscular: 'PEITO',

        exercicio: {
          id: '1',
          nome: 'Supino Reto com Barra',
          categoria: 'PEITO',
          equipamento:
            'Banco Horizontal e Barra',
          instrucao:
            'Deite no banco, desça a barra até o peito e empurre verticalmente.'
        },

        series: 4,

        repeticoes: 12,

        intervalo: '60s',

        concluido: false,

        ultimoPeso: 20,

        expandido: false
      },

      {
        diaSemana: 'Segunda',

        grupoMuscular: 'PEITO',

        exercicio: {
          id: '2',
          nome: 'Crucifixo Máquina',
          categoria: 'PEITO',
          equipamento:
            'Máquina Peck Deck',
          instrucao:
            'Mantenha os cotovelos semiflexionados e feche os braços lentamente.'
        },

        series: 3,

        repeticoes: 15,

        intervalo: '45s',

        concluido: false,

        ultimoPeso: 12,

        expandido: false
      },

      {
        diaSemana: 'Segunda',

        grupoMuscular: 'TRICEPS',

        exercicio: {
          id: '3',
          nome: 'Tríceps Corda',
          categoria: 'TRICEPS',
          equipamento:
            'Polia Alta',
          instrucao:
            'Estenda completamente os cotovelos abrindo a corda no final.'
        },

        series: 4,

        repeticoes: 10,

        intervalo: '60s',

        concluido: false,

        ultimoPeso: 18,

        expandido: false
      }
    ];
  }
}