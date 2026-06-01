import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { supabase } from '../../supabase';
import { environment } from '../../../environments/environment';

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

  listaPesos = Array.from({ length: 271 }, (_, i) => i + 30);
  
  listaAlturas = Array.from({ length: 112 }, (_, i) => {
    const val = parseFloat(((130 + i) / 100).toFixed(2));
    return { value: val, label: val.toFixed(2) + 'm' };
  });

  listaDias = Array.from({ length: 7 }, (_, i) => {
    const val = i + 1;
    return { value: val, label: val.toString().padStart(2, '0') };
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
    this.erro.set(null); // Limpa erros anteriores

    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const headers = new HttpHeaders({ 
        'Authorization': `Bearer ${session?.access_token || ''}`,
        'Content-Type': 'application/json' 
      });

      // O uso de ${environment.apiUrl} agora buscará o valor correto do environment.ts
      this.http.post(`${environment.apiUrl}/treinos/gerar`, this.form.value, { headers })
        .subscribe({
          next: () => {
            this.router.navigate(['/dashboard']);
          },
          error: (err) => { 
            console.error('Detalhes do erro:', err);
            this.erro.set('Erro ao gerar nova ficha. Verifique sua conexão.'); 
            this.carregando.set(false); 
          }
        });
    } catch (e) {
      this.erro.set('Erro ao autenticar a requisição.');
      this.carregando.set(false);
    }
  }

  voltar() { this.router.navigate(['/dashboard']); }
}