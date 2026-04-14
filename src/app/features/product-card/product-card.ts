// product-card.component.ts
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-card',
  standalone: true,
  template: `
    <div class="card h-100 shadow-sm border-0 position-relative">
      <div class="card-body">
        <span class="badge bg-light text-primary mb-2">{{ item.category || 'Nessuna categoria' }}</span>
        <h5 class="card-title fw-bold text-truncate">{{ item.title || 'Senza titolo' }}</h5>
        <p class="fs-4 fw-bold text-success">{{ item.price ? item.price + '€' : 'n.d.' }}</p>
        <p class="card-text text-muted small text-truncate-2">{{ item.description }}</p>
      </div>
      <div class="card-footer bg-transparent border-0 small text-muted">
        Gestito da: {{ item.employee }}
      </div>
      <div class="position-absolute top-0 end-0 p-2">
        <button class="btn btn-light btn-sm shadow-sm text-danger" (click)="onDelete($event)">
          <i class="bi bi-trash3"></i>
        </button>
        <button class="btn btn-sm btn-outline-info shadow-sm" 
        data-bs-toggle="modal" 
        data-bs-target="#reviewModal"
        (click)="onViewReviews($event)">
          <i class="bi bi-chat-left-text"></i> ({{ item.reviews.length }})
        </button>
      </div>
    </div>
  `
})
export class ProductCardComponent {
 @Input({ required: true }) item!: Product;
  @Output() delete = new EventEmitter<string>();
  @Output() viewReviews = new EventEmitter<string[]>();

  // Funzione per gestire la visualizzazione delle recensioni senza propagazione
  onViewReviews(event: Event) {
    // Ferma la propagazione del click per evitare di attivare altri eventi indesiderati
    event.stopPropagation(); 
    this.viewReviews.emit(this.item.reviews);
  }

  // Funzione per gestire l'eliminazione senza propagazione
  onDelete(event: Event) {
    // Ferma la propagazione del click per evitare di attivare altri eventi indesiderati
    event.stopPropagation();
    // emette l'evento di eliminazione con l'ID del prodotto
    this.delete.emit(this.item.id);
  }
}