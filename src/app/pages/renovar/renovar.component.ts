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

  listaPesos = Array.from({ length: 271 }, (_, i) => i + 30); // 30 a 300
  
  listaAlturas = Array.from({ length: 112 }, (_, i) => {
    const val = parseFloat(((130 + i) / 100).toFixed(2));
    return { value: val, label: val.toFixed(2) + 'm' }; // 1.30m a 2.40m
  });

  listaDias = Array.from({ length: 7 }, (_, i) => {
    const val = i + 1;
    return { value: val, label: val.toString().padStart(2, '0') }; // "01" a "07"
  });

  form: FormGroup = this.fb.group({
    genero: ['', Validators.required],
    peso: [null, [Validators.required, Validators.min(30), Validators.max(300)]],
    altura: [null, [Validators.required, Validators.min(1.3), Validators.max(2.4)]],
    objetivo: ['', Validators.required],
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