import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { supabase } from '../../supabase';

@Component({
  selector: 'app-renovar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './renovar.component.html',
  styleUrl: '../profile/profile.component.css'
})
export class RenovarTreinoComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private http = inject(HttpClient);

  form: FormGroup = this.fb.group({
    genero: ['', Validators.required],
    // Peso: min 30, max 300
    peso: [null, [Validators.required, Validators.min(30), Validators.max(300)]],
    // Altura: min 1.30, max 2.40
    altura: [null, [Validators.required, Validators.min(1.3), Validators.max(2.4)]],
    objetivo: ['', Validators.required],
    // Dias: min 1, max 7
    diasPorSemana: [3, [Validators.required, Validators.min(1), Validators.max(7)]],
    concordou: [false, Validators.requiredTrue]
  });

  carregando = signal(false);
  erro = signal<string | null>(null);

  async confirmarRenovacao() {
    if (this.form.invalid) return;

    this.carregando.set(true);
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${session?.access_token}` });

    this.http.post('http://localhost:8080/api/treinos/gerar', this.form.value, { headers })
      .subscribe({
        next: () => this.router.navigate(['/dashboard']),
        error: () => { this.erro.set('Erro ao gerar nova ficha.'); this.carregando.set(false); }
      });
  }

  voltar() { this.router.navigate(['/dashboard']); }
}