import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // se c'è un problema di rete (status 0) o se l'errore è un ProgressEvent, lo si gestisce in modo specifico
      if (error.status === 0 && error.error instanceof ProgressEvent) {
        // getta l'errore evitando di mostrare il toast
         return throwError(() => error);
      }

      let errorMessage = 'Si è verificato un errore imprevisto';
      if (error.status === 404) {
        errorMessage = 'Risorsa non trovata (404)';
      } else if (error.status === 500) {
        errorMessage = 'Errore interno del server (500)';
      } else if (error.status === 0) {
        errorMessage = 'Impossibile connettersi al server. Controlla la connessione.';
      }

      toastService.show(errorMessage, 'danger');
      return throwError(() => error);
    })
  );
};