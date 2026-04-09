import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable, map, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly _http = inject(HttpClient);
  private readonly _baseUrl = 'https://us-central1-test-b7665.cloudfunctions.net/api';
  private readonly _storeId = 'ijpxNJLM732vm8AeajMR';

  // URL per l'API dei prodotti
  private readonly apiUrl = `${this._baseUrl}/stores/${this._storeId}/products`;

  private _products = signal<Product[]>([]);
  private _isLoading = signal<boolean>(false);
  private _currentPage = signal<number>(1);
  private _totalElements = signal<number>(0);

  public readonly products = this._products.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly currentPage = this._currentPage.asReadonly();
  public readonly totalElements = this._totalElements.asReadonly();

  public fetchProducts(page: number = 0): void {
    this._isLoading.set(true);

    this._http.get<any>(this.apiUrl).subscribe({
      next: (response) => {
        // L'API potrebbe restituire un array diretto o un oggetto con chiave 'products'
        const rawProducts = Array.isArray(response) ? response : response.products || [];

        const sanitizedData = rawProducts.map((item: any) => {
          // Se l'item ha una struttura { data: { ... } }, estraiamo i campi da 'data'
          const fields = item.data || item;

          // Ritorna un oggetto Product
          return {
            ...fields,
            // Se l'ID è presente, si usa quello; altrimenti, si genera un ID unico
            id: item.id || fields.id || `legacy-${crypto.randomUUID()}`,
            reviews: fields.reviews || [],
          } as Product;
        });

        this._products.set(sanitizedData);

        this._totalElements.set(response.total || sanitizedData.length);
        this._currentPage.set(page);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Errore fetch:', err);
        this._isLoading.set(false);
      },
    });
  }

  // Aggiunge un nuovo prodotto e aggiorna lo stato locale
  public addProduct(payload: any): Observable<Product> {
    // Post invia i dati ad apiUrl
    // L'oggetto avrà come responseType 'text' che rappresenta l'ID del nuovo prodotto creato
    // Restituisce un Observable che mappa l'ID ricevuto in un oggetto Product completo, unendo i dati inviati con l'ID restituito
    return this._http.post(this.apiUrl, payload, { responseType: 'text' }).pipe(
      map((newId: string) => {
        return {
          id: newId,
          ...payload.data,
        } as Product;
      }),
      // Si aggiorna this._products aggiungendo il nuovo prodotto all'inizio dell'array
      tap((newProduct) => {
        this._products.update((current) => [newProduct, ...current]);
      }),
    );
  }

  // Elimina un prodotto dato il suo ID e aggiorna lo stato locale
  public deleteProduct(productId: string): Observable<string> {
    const url = `${this.apiUrl}/${productId}`;

    return this._http.delete(url, { responseType: 'text' }).pipe(
      tap(() => {
        this._products.update((current) => current.filter((p) => p.id !== productId));
      }),
    );
  }
}
