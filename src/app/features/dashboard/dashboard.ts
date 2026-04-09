import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductTableRowComponent } from '../product-table-row/product-table-row';
import { ProductCardComponent } from '../product-card/product-card';
import { ProductFormComponent } from '../product-form/product-form';
import { ReviewModalComponent } from '../review-modal/review-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: `<div class="container mt-4">
  <div class="d-flex justify-content-between align-items-center mb-4">
    <h2 class="h4 mb-0 fw-bold">Gestione Negozio</h2>
    <div class="d-flex gap-2">
      <button class="btn btn-success" data-bs-toggle="modal" data-bs-target="#productModal">
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
    <div class="text-center py-5"><div class="spinner-border text-primary"></div></div>
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
  <tr app-product-table-row [item]="product" (delete)="onDelete($event)"></tr>
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
  (viewReviews)="openReviews($event)">
  </app-product-card>
          </div>
        }
      </div>
    }

    <app-product-form (submitted)="onAddProduct($event)"></app-product-form>
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
    (click)="changePage(-1)">
    Precedente
  </button>
  
  <button 
    class="btn btn-outline-primary" 
    [disabled]="currentPage() >= Math.ceil(products().length / 10)" 
    (click)="changePage(1)">
    Successiva
  </button>
</div>
</div>
</div>
  `,
  imports: [
    CommonModule,
    ProductTableRowComponent,
    ProductCardComponent,
    ProductFormComponent,
    ReviewModalComponent
  ]
})
export class Dashboard implements OnInit {
  protected readonly Math = Math;
  private readonly _productService = inject(ProductService);
  protected readonly products = this._productService.products;
  protected readonly isLoading = this._productService.isLoading;

  protected readonly currentPage = this._productService.currentPage;
  protected readonly totalElements = this._productService.totalElements;
  protected isTableView = signal<boolean>(true);
  protected selectedReviews = signal<string[]>([]);
  
  ngOnInit() {
    this._productService.fetchProducts(1);
  }

  // Metodo per aggiungere un prodotto
  protected onAddProduct(payload: any): void {
    this._productService.addProduct(payload).subscribe({
      next: () => console.log('Prodotto salvato tramite Dashboard!'),
      error: (err) => {
        const msg = typeof err.error === 'string' ? err.error : (err.error?.text || 'Errore');
        alert('Attenzione: ' + msg);
      }
    });
  }

  // Metodo per eliminare un prodotto
  protected onDelete(productId: string | undefined): void {
  console.log('--- onDelete Dashboard ricevuto ID:', productId);
  
  if (!productId || productId === "") {
    alert("Attenzione: Questo prodotto ha un ID vuoto e non può essere rimosso dal database!");
    return;
  }

  if (confirm('Sei sicuro di voler eliminare questo prodotto?')) {
    this._productService.deleteProduct(productId).subscribe({
      next: () => console.log('Eliminazione riuscita'),
      error: (err) => alert('Errore server: ' + err)
    });
  }
}

// Computed per ottenere i prodotti da visualizzare in base alla pagina corrente
protected readonly displayedProducts = computed(() => {
  const pageSize = 10;
  const start = (this.currentPage() - 1) * pageSize;
  return this.products().slice(start, start + pageSize);
});

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

  // metodo per aprire il modal delle recensioni, con gestione del caso senza recensioni
  protected openReviews(reviews: string[]): void {
  this.selectedReviews.set(reviews || []);
}
}