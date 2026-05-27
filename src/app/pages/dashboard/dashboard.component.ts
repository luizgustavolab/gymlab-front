import {
  Component,
  OnInit,
  inject,
  signal,
  computed
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { Router } from '@angular/router';

import { TreinoService } from '../../services/treino';

import { supabase } from '../../supabase';

interface Treino {

  diaSemana: string;

  grupoMuscular: string;

  exercicioNome: string;

  equipamento: string;

  instrucao: string;

  series: number;

  repeticoes: number;

  intervalo: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  private treinoService =
    inject(TreinoService);

  private router =
    inject(Router);

  protected carregando =
    signal(true);

  protected erro =
    signal<string | null>(null);

  protected treinos =
    signal<Treino[]>([]);

  protected treinosAgrupados =
    computed(() => {

      const agrupados:
        Record<string, Treino[]> = {};

      for (const treino of this.treinos()) {

        if (!agrupados[treino.diaSemana]) {

          agrupados[treino.diaSemana] = [];
        }

        agrupados[treino.diaSemana]
          .push(treino);
      }

      return agrupados;
    });

  ngOnInit(): void {

    this.carregarTreinos();
  }

  protected carregarTreinos(): void {

    this.carregando.set(true);

    this.erro.set(null);

    this.treinoService
      .buscarMeuTreino()
      .subscribe({

        next: (response: any) => {

          this.treinos.set(response);

          this.carregando.set(false);
        },

        error: (err) => {

          console.error(err);

          this.erro.set(
            'Erro ao carregar treino.'
          );

          this.carregando.set(false);
        }
      });
  }

  protected async sair(): Promise<void> {

    await supabase.auth.signOut();

    this.router.navigate(['/']);
  }
}