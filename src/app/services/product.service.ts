import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = 'https://us-central1-test-b7665.cloudfunctions.net/api';
  private readonly _storeId = 'ijpxNJLM732vm8AeajMR';

  // Costruiamo l'URL base per i prodotti di questo store
  private readonly apiUrl = `${this._baseUrl}/stores/${this._storeId}/products`;

  private _products = signal<Product[]>([]);
  private _isLoading = signal<boolean>(false);
  private _currentPage = signal<number>(1);
  private _totalElements = signal<number>(0);

  public readonly products = this._products.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly currentPage = this._currentPage.asReadonly();
  public readonly totalElements = this._totalElements.asReadonly();

  fetchProducts(page: number = 0): void {
  this._isLoading.set(true);
  
  // Proviamo a non inviare parametri per ora, visto che il server crasha con ?page=1
  // Se vuoi riprovare la paginazione in futuro, usa .set('page', '0')
  
  this._http.get<any>(this.apiUrl).subscribe({
    next: (response) => {
      // Firebase restituisce spesso i dati direttamente o in una proprietà
      const rawProducts = Array.isArray(response) ? response : (response.products || []);
      
      const sanitizedData = rawProducts.map((item: any) => {
        // Estraiamo i campi da 'data' (struttura Firebase) o dall'item stesso
        const fields = item.data || item;
        
        return {
          ...fields,
          id: item.id || fields.id || `legacy-${crypto.randomUUID()}`,
          reviews: fields.reviews || []
        } as Product;
      });

      this._products.set(sanitizedData);
      
      // Se l'API non manda il totale, contiamo quelli che abbiamo
      this._totalElements.set(response.total || sanitizedData.length);
      this._currentPage.set(page);
      this._isLoading.set(false);
    },
    error: (err) => {
      console.error('Errore fetch:', err);
      this._isLoading.set(false);
      // Opzionale: alert('Il server ha risposto con errore 500');
    }
  });
}

  public addProduct(payload: any): Observable<Product> {
    // Il payload arriva già nel formato { data: { ... } } dal componente
    return this._http.post(this.apiUrl, payload, { responseType: 'text' }).pipe( 
      map((newId: string) => {
        return {
          id: newId,
          ...payload.data
        } as Product;
      }),
      tap((newProduct) => {
        this._products.update((current) => [newProduct, ...current]);
      })
    );
  }

  public deleteProduct(productId: string): Observable<string> {
    const url = `${this.apiUrl}/${productId}`;
    
    return this._http.delete(url, { responseType: 'text' }).pipe(
      tap(() => {
        this._products.update((current) => current.filter(p => p.id !== productId));
      })
    );
  }
}