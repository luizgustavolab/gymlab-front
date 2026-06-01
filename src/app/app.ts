import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly exibirBanner = signal(!localStorage.getItem('gymlab_lgpd_consent'));

  protected computarConsentimento(aceitou: boolean): void {
    localStorage.setItem('gymlab_lgpd_consent', JSON.stringify({ consentido: aceitou }));
    this.exibirBanner.set(false);
  }
}