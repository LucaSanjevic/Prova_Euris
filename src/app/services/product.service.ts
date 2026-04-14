import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product.model';
import { Observable, map, of, tap } from 'rxjs';
import { ToastService } from './toast';


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
  public readonly searchTerm = signal<string>('');

  public readonly products = this._products.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly currentPage = this._currentPage.asReadonly();
  public readonly totalElements = this._totalElements.asReadonly();
  private readonly _toastService = inject(ToastService);


  // computed che filtra i prodotti in base al searchTerm, cercando sia nel titolo che nella categoria
  public readonly filteredProducts = computed(() => {
  const term = this.searchTerm().toLowerCase();
  const allProducts = this.products();
  if (!term) return allProducts;
  return allProducts.filter(p => 
    p.title.toLowerCase().includes(term) || 
    p.category?.toLowerCase().includes(term)
  );
});

  public fetchProducts(): void {
    // Imposta isLoading a true prima di iniziare la richiesta
  this._isLoading.set(true);
  this._http.get<any>(this.apiUrl).subscribe({
    next: (res) => {
      // La risposta potrebbe essere un array di prodotti o un oggetto con una proprietà "products"
      const raw = Array.isArray(res) ? res : res.products || [];
      const sanitized = raw.map((item: any) => {
        // se l'item ha una proprietà "data", usala come base, altrimenti usa l'item stesso
        const d = item.data || item;
        // crea un nuovo Product sovrascrivendo id e reviews se non sono presenti
        return {
          ...d,
          id: item.id || d.id,
          reviews: d.reviews || []
        } as Product;
      });
      // aggiorna _products con la lista sanificata e imposta isLoading a false
      this._products.set(sanitized);
      this._isLoading.set(false);
    },
    error: () => this._isLoading.set(false)
  });
}

public updateProduct(productId: string, payload: any): Observable<void> {
  this._products.update(list => 
    // se l'id del prodotto corrisponde a productId, crea un nuovo oggetto unendo il prodotto esistente con i nuovi dati, altrimenti mantieni il prodotto invariato
    list.map(p => p.id === productId ? { ...p, ...payload.data } : p)
  );
  // Mostra un toast di conferma
  this._toastService.show('Modifica salvata localmente', 'info');
  return of(void 0);
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
