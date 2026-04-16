import { Injectable, signal } from '@angular/core';

export interface Toast {
  message: string;
  type: 'success' | 'danger';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  // Signal che contiene un array dei toast attivi
  toasts = signal<Toast[]>([]);

  // Funzione per mostrare un nuovo toast. Accetta un messaggio e un tipo (success, danger)
  show(message: string, type: 'success' | 'danger' = 'success') {
    // Dichiara un nuovo toast con il messaggio e il tipo specificati
    const newToast = { message, type };
    // Aggiunge il nuovo toast alla lista dei toast attivi
    this.toasts.update((t) => [...t, newToast]);
    // Rimuove il toast dopo 3 secondi
    setTimeout(() => {
      this.toasts.update((t) => t.filter((x) => x !== newToast));
    }, 3000);
  }
}
