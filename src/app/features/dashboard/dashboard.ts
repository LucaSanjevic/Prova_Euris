import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { ProductTableRowComponent } from '../product-table-row/product-table-row';
import { ProductCardComponent } from '../product-card/product-card';
import { ProductFormComponent } from '../product-form/product-form';
import { ReviewModalComponent } from '../review-modal/review-modal';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  templateUrl: './dashboard.html', // RIPRISTINA QUESTO
  styleUrls: ['./dashboard.scss'], // RIPRISTINA QUESTO
  // template: '...',             // CANCELLA QUESTO
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
    this._productService.fetchProducts();
  }

  // Metodo per aggiungere un prodotto, con gestione errori
  protected onAddProduct(payload: any): void {
    this._productService.addProduct(payload).subscribe({
      next: () => console.log('Prodotto salvato tramite Dashboard!'),
      error: (err) => {
        const msg = typeof err.error === 'string' ? err.error : (err.error?.text || 'Errore');
        alert('Attenzione: ' + msg);
      }
    });
  }

  // Metodo per eliminare un prodotto, con conferma e gestione errori
  // dashboard.ts
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

  // Metodo per cambiare pagina, con controllo sui limiti
  protected changePage(page: number): void {
    const newPage = this.currentPage() + page;
    const maxPage = Math.ceil(this.totalElements() / 10);
    if (newPage >= 1 && newPage <= maxPage) {
      this._productService.fetchProducts(newPage);
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