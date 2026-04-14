import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'danger' | 'info';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: 'success' | 'danger' | 'info' = 'success') {
    // Aggiunge un nuovo toast alla lista
    const newToast = { message, type };
    // aggiunge il messaggio alla lista dei toast
    this.toasts.update(t => [...t, newToast]);

    // Rimuove il toast dopo 3 secondi
    setTimeout(() => {
      this.toasts.update(t => t.filter(x => x !== newToast));
    }, 3000);
  }
}