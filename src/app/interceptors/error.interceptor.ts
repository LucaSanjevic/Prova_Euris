import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Iniettiamo il servizio dei Toast per mostrare i messaggi
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Si è verificato un errore imprevisto';

      // Personalizziamo il messaggio in base al codice errore
      if (error.status === 404) {
        errorMessage = 'Risorsa non trovata (404)';
      } else if (error.status === 500) {
        errorMessage = 'Errore interno del server (500)';
      } else if (error.status === 0) {
        errorMessage = 'Impossibile connettersi al server. Controlla la connessione.';
      }

      // Lanciamo il Toast!
      toastService.show(errorMessage, 'danger');

      // Ritorna l'errore così se un componente specifico vuole gestirlo ulteriormente, può farlo
      return throwError(() => error);
    })
  );
};