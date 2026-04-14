import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastService } from './services/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div class="container">
        <a class="navbar-brand fw-bold" routerLink="/">
          <i class="bi bi-shop me-2"></i>Negozio di dolci
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

    <div class="toast-container position-fixed bottom-0 end-0 p-3" style="z-index: 1100">
      @for (toast of toastService.toasts(); track $index) {
        <div class="toast show align-items-center text-white border-0 mb-2" 
             [class.bg-success]="toast.type === 'success'"
             [class.bg-danger]="toast.type === 'danger'"
             role="alert">
          <div class="d-flex">
            <div class="toast-body">
              <i class="bi" [class.bi-check-circle]="toast.type === 'success'" [class.bi-exclamation-triangle]="toast.type === 'danger'"></i>
              {{ toast.message }}
            </div>
          </div>
        </div>
      }
    </div>
    
    <style>
      .nav-link { color: rgba(255,255,255,0.8); }
      .nav-link.active { color: #fff !important; }
      .transition { transition: all 0.2s ease-in-out; }
    </style>
  `
})
export class App {
  protected readonly title = signal('euris_test');
  protected readonly toastService = inject(ToastService);
}