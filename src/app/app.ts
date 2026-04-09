import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">
          <i class="bi bi-box-seam me-2"></i>Euris Store
        </a>
        
        <div class="navbar-nav ms-auto flex-row gap-3">
          <a class="nav-link px-3 transition" 
             routerLink="/dashboard" 
             routerLinkActive="active fw-bold border-bottom">
            <i class="bi bi-table me-1"></i>Tabella
          </a>
          <a class="nav-link px-3 transition" 
             routerLink="/chart" 
             routerLinkActive="active fw-bold border-bottom">
            <i class="bi bi-bar-chart me-1"></i>Grafico
          </a>
        </div>
      </div>
    </nav>

    <main>
      <router-outlet></router-outlet>
    </main>

    <style>
      .nav-link { color: rgba(255,255,255,0.8); }
      .nav-link.active { color: #fff !important; }
      .transition { transition: all 0.2s ease-in-out; }
    </style>
  `
})
export class App {
  protected readonly title = signal('euris_test');
}