import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { from, switchMap, throwError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { supabase } from '../supabase';

// Definição da interface para garantir a tipagem dos dados recebidos
export interface ExercicioTreino {
  diaSemana: string;
  grupoMuscular: string;
  exercicioNome: string;
  equipamento: string;
  instrucao: string;
  series: number;
  repeticoes: number;
  intervalo: string;
}

@Injectable({
  providedIn: 'root'
})
export class TreinoService {

  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private obterHeaders(): Observable<HttpHeaders> {
    return from(supabase.auth.getSession()).pipe(
      switchMap(({ data, error }) => {
        if (error) {
          console.error('Erro ao obter sessão:', error);
          return throwError(() => error);
        }

        const token = data.session?.access_token;

        if (!token) {
          console.error('Token JWT não encontrado.');
          return throwError(() => new Error('Usuário não autenticado.'));
        }

        const headers = new HttpHeaders({
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        return [headers];
      })
    );
  }

  gerarTreino(payload: unknown, tokenManual?: string) {
    if (tokenManual) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${tokenManual}`,
        'Content-Type': 'application/json'
      });

      return this.http.post(`${this.apiUrl}/treinos/gerar`, payload, { headers });
    }

    return this.obterHeaders().pipe(
      switchMap(headers =>
        this.http.post(`${this.apiUrl}/treinos/gerar`, payload, { headers })
      )
    );
  }

  // Método unificado para buscar os treinos
  buscarMeuTreino(): Observable<ExercicioTreino[]> {
    return this.obterHeaders().pipe(
      switchMap(headers =>
        this.http.get<ExercicioTreino[]>(`${this.apiUrl}/treinos/me`, { headers })
      )
    );
  }
}