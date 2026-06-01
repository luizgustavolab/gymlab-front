import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TreinoService, ExercicioTreino } from '../../services/treino';
import { supabase } from '../../supabase';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private treinoService = inject(TreinoService);
  private router = inject(Router);

  protected carregando = signal(true);
  protected erro = signal<string | null>(null);
  protected treinos = signal<ExercicioTreino[]>([]);
  
  protected exerciciosExpandidos = signal<Set<string>>(new Set());
  protected exerciciosConcluidos = signal<Set<string>>(new Set());
  protected treinoAtivo = signal<string | null>(null);

  protected treinosAgrupados = computed(() => {
    const agrupados: Record<string, ExercicioTreino[]> = {};
    for (const treino of this.treinos()) {
      if (!agrupados[treino.diaSemana]) {
        agrupados[treino.diaSemana] = [];
      }
      agrupados[treino.diaSemana].push(treino);
    }
    return agrupados;
  });

  protected diasDisponiveis = computed(() => Object.keys(this.treinosAgrupados()));

  ngOnInit(): void {
    this.carregarTreinos();
  }

  protected carregarTreinos(): void {
    this.carregando.set(true);
    this.erro.set(null);

    this.treinoService.buscarMeuTreino().subscribe({
      next: (response: ExercicioTreino[]) => {
        this.treinos.set(response);
        const chaves = Object.keys(this.treinosAgrupados());
        if (chaves.length > 0) {
          this.treinoAtivo.set(chaves[0]);
        }
        this.carregando.set(false);
      },
      error: (err) => {
        console.error(err);
        this.erro.set('Erro ao carregar treino.');
        this.carregando.set(false);
      }
    });
  }

  protected gerarNovaFicha(): void {
    this.router.navigate(['/renovar']);
  }

  protected toggleExercicio(nome: string): void {
    const novosExpandidos = new Set(this.exerciciosExpandidos());
    if (novosExpandidos.has(nome)) {
      novosExpandidos.delete(nome);
    } else {
      novosExpandidos.add(nome);
    }
    this.exerciciosExpandidos.set(novosExpandidos);
  }

  protected isExpandido(nome: string): boolean {
    return this.exerciciosExpandidos().has(nome);
  }

  protected toggleConcluido(nome: string, event: Event): void {
    event.stopPropagation();
    const novosConcluidos = new Set(this.exerciciosConcluidos());
    if (novosConcluidos.has(nome)) {
      novosConcluidos.delete(nome);
    } else {
      novosConcluidos.add(nome);
    }
    this.exerciciosConcluidos.set(novosConcluidos);
  }

  protected isConcluido(nome: string): boolean {
    return this.exerciciosConcluidos().has(nome);
  }

  protected selecionarTreino(dia: string): void {
    if (this.treinoAtivo() === dia) {
      this.treinoAtivo.set(null);
    } else {
      this.treinoAtivo.set(dia);
      this.exerciciosExpandidos.set(new Set());
    }
  }

  protected async sair(): Promise<void> {
    await supabase.auth.signOut();
    this.router.navigate(['/']);
  }
}