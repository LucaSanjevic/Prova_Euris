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

  // Signal che contiene la lista dei prodotti
  private _products = signal<Product[]>([]);
  // Signal che indica se i prodotti sono in fase di caricamento
  private _isLoading = signal<boolean>(false);
  // Signal che tiene traccia della pagina corrente per la paginazione
  private _currentPage = signal<number>(1);
  // Signal che contiene il termine di ricerca per filtrare i prodotti
  public readonly searchTerm = signal<string>('');

  // si rendono i signal leggibili dall'esterno, ma non modificabili direttamente
  public readonly products = this._products.asReadonly();
  public readonly isLoading = this._isLoading.asReadonly();
  public readonly currentPage = this._currentPage.asReadonly();

  // Computed che filtra i prodotti in base al searchTerm, cercando sia nel titolo che nella categoria
  public readonly filteredProducts = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const allProducts = this.products();
    if (!term) return allProducts;
    return allProducts.filter(
      (p) => p.title.toLowerCase().includes(term) || p.category?.toLowerCase().includes(term),
    );
  });

  // Funzione per recuperare i prodotti dall'API e aggiornare lo stato locale
  public fetchProducts(): void {
    // Imposta isLoading a true
    this._isLoading.set(true);
    // Richiesta GET
    this._http.get<any>(this.apiUrl).subscribe({
      next: (res) => {
        // Se res è un array lo prende direttamente, altrimenti cerca la proprietà "products"
        const raw = Array.isArray(res) ? res : res.products || [];
        const sanitized = raw.map((item: any) => {
          // Se l'item ha una proprietà "data" si usa quella altrimenti l'item stesso
          const d = item.data || item;
          // Crea un nuovo Product sovrascrivendo id e reviews se non sono presenti
          return {
            ...d,
            id: item.id || d.id,
            reviews: d.reviews || [],
          } as Product;
        });
        // Aggiorna _products e imposta isLoading a false
        this._products.set(sanitized);
        this._isLoading.set(false);
      },
      error: () => this._isLoading.set(false),
    });
  }

  public updateProduct(productId: string, payload: any): Observable<void> {
    this._products.update((list) =>
      // Trova l'id uguale a productId e crea un nuovo oggetto unendo il prodotto esistente con i nuovi dati
      list.map((p) => (p.id === productId ? { ...p, ...payload.data } : p)),
    );
    // Restituisce un Observable che emette void, indicando che l'operazione è completata
    return of(void 0);
  }

  // Aggiunge un nuovo prodotto e aggiorna lo stato locale
  // Nel ProductService
public addProduct(payload: any): Observable<Product> {
  // Chiamata POST
  return this._http.post(this.apiUrl, payload.data, { responseType: 'text' }).pipe(
    map((newId: string) => {
      // Crea un nuovo prodotto combinando l'ID restituito dall'API con i dati inviati
      return {
        id: newId,
        ...payload.data,
      } as Product;
    }),
    // Aggiorna lo stato locale aggiungendo il nuovo prodotto all'inizio della lista
    tap((newProduct) => {
      this._products.update((current) => [newProduct, ...current]);
    }),
  );
}

  // Elimina un prodotto dato il suo ID e aggiorna lo stato locale
  public deleteProduct(productId: string): Observable<string> {
    const url = `${this.apiUrl}/${productId}`;
    // Fa una richiesta DELETE
    return this._http.delete(url, { responseType: 'text' }).pipe(
      tap(() => {
        this._products.update((current) => current.filter((p) => p.id !== productId));
      }),
    );
  }
}
