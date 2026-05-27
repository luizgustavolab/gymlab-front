import {
  Component,
  EventEmitter,
  Input,
  Output
} from '@angular/core';

import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  @Input()
  usuarioNome = 'Usuário';

  @Input()
  treinoHoje = 'Treino';

  @Output()
  logoutClick = new EventEmitter<void>();

  @Output()
  gerarTreinoClick = new EventEmitter<void>();

  @Output()
  perfilClick = new EventEmitter<void>();

  protected logout(): void {
    this.logoutClick.emit();
  }

  protected gerarTreino(): void {
    this.gerarTreinoClick.emit();
  }

  protected abrirPerfil(): void {
    this.perfilClick.emit();
  }
}