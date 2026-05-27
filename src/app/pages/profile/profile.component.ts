import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="app-container">

      <div class="card">

        <h1 class="title">
          Perfil
        </h1>

      </div>

    </div>
  `
})
export class ProfileComponent {}