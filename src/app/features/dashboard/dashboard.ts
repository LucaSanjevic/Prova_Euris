import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductTableRowComponent } from '../product-table-row/product-table-row';
import { ProductCardComponent } from '../product-card/product-card';
import { ProductFormComponent } from '../product-form/product-form';
import { ReviewModalComponent } from '../review-modal/review-modal';
import { LoaderComponent } from '../loader/loader/loader';
import { Product } from '../../models/product.model';
import { ToastService } from '../../services/toast';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `<div class="container mt-4">
    <div class="row mb-3">
      <div class="col-md-6">
        <div class="input-group">
          <span class="input-group-text bg-white"><i class="bi bi-search"></i></span>
          <input
            type="text"
            class="form-control border-start-0"
            placeholder="Cerca per nome o categoria..."
            (input)="updateSearch($event)"
          />
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="h4 mb-0 fw-bold">Gestione Negozio</h2>
      <div class="d-flex gap-2">
        <button
          class="btn btn-success"
          data-bs-toggle="modal"
          data-bs-target="#productModal"
          (click)="selectedProduct.set(null)"
        >
          <i class="bi bi-plus-lg me-2"></i>Nuovo Prodotto
        </button>

        <div class="btn-group">
          <button class="btn" [class.btn-primary]="isTableView()" (click)="toggleView()">
            <i class="bi bi-list-ul"></i>
          </button>
          <button class="btn" [class.btn-primary]="!isTableView()" (click)="toggleView()">
            <i class="bi bi-grid-3x3-gap"></i>
          </button>
        </div>
      </div>
    </div>

    @if (isLoading()) {
      <div class="table-responsive card shadow-sm border-0 p-3">
        <table class="table align-middle">
          <thead>
            <tr>
              <th><app-loader width="100px"></app-loader></th>
              <th><app-loader width="80px"></app-loader></th>
              <th><app-loader width="150px"></app-loader></th>
              <th><app-loader width="80px"></app-loader></th>
              <th class="text-end"><app-loader width="50px"></app-loader></th>
              <th class="text-center"><app-loader width="60px"></app-loader></th>
            </tr>
          </thead>
          <tbody>
            @for (i of [1, 2, 3, 4, 5]; track i) {
              <tr>
                <td><app-loader height="25px"></app-loader></td>
                <td><app-loader height="25px" width="70%"></app-loader></td>
                <td><app-loader height="25px" width="90%"></app-loader></td>
                <td><app-loader height="25px" width="60%"></app-loader></td>
                <td><app-loader height="25px"></app-loader></td>
                <td><app-loader height="25px" width="40%"></app-loader></td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    } @else {
      @if (isTableView()) {
        <div class="table-responsive card shadow-sm border-1">
          <table class="table table-hover align-middle mb-0">
            <thead class="table-secondary">
              <tr>
                <th>Nome</th>
                <th>Categoria</th>
                <th>Descrizione</th>
                <th>Dipendente</th>
                <th class="text-end">Prezzo</th>
                <th class="text-center">Azioni</th>
              </tr>
            </thead>
            <tbody>
              @for (product of displayedProducts(); track product.id) {
                <tr
                  app-product-table-row
                  [item]="product"
                  (delete)="onDelete($event)"
                  (edit)="selectedProduct.set($event)"
                ></tr>
              }
            </tbody>
          </table>
        </div>
      } @else {
        <div class="row g-4">
          @for (product of displayedProducts(); track product.id) {
            <div class="col-12 col-md-6 col-lg-4 col-xl-3">
              <app-product-card
                [item]="product"
                (delete)="onDelete($event)"
                (edit)="selectedProduct.set($event)"
                (viewReviews)="openReviews($event)"
              >
              </app-product-card>
            </div>
          }
        </div>
      }

      <app-product-form [productToEdit]="selectedProduct()" (submitted)="onAddProduct($event)">
      </app-product-form>
      <app-review-modal [reviews]="selectedReviews()"></app-review-modal>
    }

    <div class="d-flex justify-content-between align-items-center mt-4 pb-5">
      <div class="text-muted small">
        Pagina <strong>{{ currentPage() }}</strong>
      </div>
      <div class="btn-group shadow-sm">
        <button
          class="btn btn-outline-primary"
          [disabled]="currentPage() === 1"
          (click)="changePage(-1)"
        >
          Precedente
        </button>

        <button
          class="btn btn-outline-primary"
          [disabled]="currentPage() >= Math.ceil(products().length / 10)"
          (click)="changePage(1)"
        >
          Successiva
        </button>
      </div>
    </div>
  </div> `,
  imports: [
    CommonModule,
    ProductTableRowComponent,
    ProductCardComponent,
    ProductFormComponent,
    ReviewModalComponent,
    LoaderComponent,
  ],
})
export class Dashboard implements OnInit {
  protected readonly Math = Math;
  private readonly _productService = inject(ProductService);
  protected readonly products = this._productService.products;
  protected readonly isLoading = this._productService.isLoading;
  protected readonly _toastService = inject(ToastService);

  protected readonly currentPage = this._productService.currentPage;
  protected isTableView = signal<boolean>(true);
  protected selectedReviews = signal<string[]>([]);
  // Inizialmente null. Quando si clicca su Modifica assume il valore  del prodotto che viene passato al product form
  protected selectedProduct = signal<Product | null>(null);

  ngOnInit() {
    this._productService.fetchProducts();
  }

  // Metodo per aggiungere un prodotto (payload contiene i dati del prodotto da aggiungere o modificare, emessi dal ProductFormComponent)
  protected onAddProduct(payload: any): void {
    const currentProduct = this.selectedProduct();

    // Se esiste selectedProduct significa parte la modifica sennò è una nuova aggiunta
    if (currentProduct) {
      this._productService.updateProduct(currentProduct.id!, payload).subscribe({
        next: () => {
          this._productService.fetchProducts();
          this._toastService.show('Prodotto aggiornato!', 'success');
        },
      });
    } else {
      this._productService.addProduct(payload).subscribe({
        next: () => this._productService.fetchProducts(),
      });
    }
    this.selectedProduct.set(null);
  }

  // Metodo per eliminare un prodotto
  protected onDelete(productId: string | undefined): void {
    if (!productId || productId === '') {
      alert('Attenzione: Questo prodotto ha un ID vuoto e non può essere rimosso dal database!');
      return;
    }
    if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
      this._productService.deleteProduct(productId).subscribe({
        next: () => this._toastService.show('Prodotto eliminato con successo', 'success'),
        error: (err) => this._toastService.show('Errore server: ' + err, 'danger'),
      });
    }
  }

  // Mostra tutti i prodotti filtrati in base alla pagina corrente, usando il computed filteredProducts del service
  protected readonly displayedProducts = computed(() => {
    const pageSize = 10;
    const start = (this.currentPage() - 1) * pageSize;
    return this._productService.filteredProducts().slice(start, start + pageSize);
  });

  // Metodo che modifica il searchTerm del service quando l'utente digita nella barra di ricerca
  protected updateSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this._productService.searchTerm.set(target.value);
    // Resetta la pagina a 1
    (this._productService as any)._currentPage.set(1);
  }

  // Metodo per cambiare pagina
  protected changePage(page: number): void {
    const newPage = this.currentPage() + page;
    const maxPage = Math.ceil(this.products().length / 10);

    if (newPage >= 1 && newPage <= maxPage) {
      (this._productService as any)._currentPage.set(newPage);
    }
  }

  // Metodo per togglare la vista tra tabella e card
  protected toggleView(): void {
    this.isTableView.set(!this.isTableView());
  }

  // Metodo per aprire il modal delle recensioni
  protected openReviews(reviews: string[]): void {
    this.selectedReviews.set(reviews || []);
  }
}
