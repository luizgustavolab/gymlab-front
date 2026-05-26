import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('gymlab-front');
  
  protected readonly exibirBanner = signal(!localStorage.getItem('gymlab_lgpd_consent'));

  protected computarConsentimento(aceitou: boolean): void {
    const logConsentimento = {
      consentido: aceitou,
      dataHora: new Date().toISOString(),
      versaoTermo: '1.0'
    };
    
    localStorage.setItem('gymlab_lgpd_consent', JSON.stringify(logConsentimento));
    this.exibirBanner.set(false);
    
    console.log('Consentimento gravado localmente:', logConsentimento);
  }
}