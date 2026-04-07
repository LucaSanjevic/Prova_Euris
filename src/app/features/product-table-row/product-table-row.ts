import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product.model';

@Component({
  selector: '[app-product-table-row]',
  standalone: true,
template: `
    <td class="fw-semibold">
      {{ item.title || $any(item).data?.title }}
    </td>
    
    <td>
      <span class="badge bg-light text-dark border">
        {{ item.category || $any(item).data?.category || 'Categoria assente' }}
      </span>
    </td>
    
    <td class="small text-muted">
      {{ item.description || $any(item).data?.description || 'Descrizione assente' }}
    </td>
    
    <td>
      {{ item.employee || $any(item).data?.employee || 'Admin' }}
    </td>
    
    <td class="text-end fw-bold text-success">
      {{ item.price || $any(item).data?.price }}€
    </td>
    
    <td class="text-center">
      <div class="d-flex justify-content-center gap-2">
        <button 
          class="btn btn-outline-info btn-sm border-0" 
          (click)="viewReviews.emit(item.reviews || $any(item).data?.reviews)"
          data-bs-toggle="modal" 
          data-bs-target="#reviewModal">
          <i class="bi bi-chat-left-text"></i>
          <span class="ms-1 small">
            {{ (item.reviews || $any(item).data?.reviews)?.length || 0 }}
          </span>
        </button>

        <button 
          class="btn btn-outline-danger btn-sm border-0" 
          (click)="delete.emit(item.id || $any(item).data?.id)"> <i class="bi bi-trash3"></i>
        </button>
      </div>
    </td>
`
})
export class ProductTableRowComponent {
  @Input({ required: true }) item!: Product;
  @Output() delete = new EventEmitter<string>();
  @Output() viewReviews = new EventEmitter<string[]>();

  handleDelete(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    
    // Cerchiamo l'ID ovunque sia
    const finalId = this.item.id || (this.item as any).data?.id;
    
    console.log('Click su riga:', this.item.title || (this.item as any).data?.title);
    console.log('ID trovato:', finalId);

    if (finalId) {
      this.delete.emit(finalId);
    } else {
      console.error('ERRORE: Questo prodotto non ha un ID, non posso eliminarlo!');
      // Se vuoi eliminarlo comunque (per pulizia), emetti una stringa finta
      // this.delete.emit('missing-id');
    }
  }
}