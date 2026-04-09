import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `<div class="modal fade" id="productModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content border-0 shadow-lg">
      <div class="modal-header bg-primary text-white">
        <h5 class="modal-title">Aggiungi Nuovo Prodotto</h5>
        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>

      <div class="modal-body p-4">
        <form [formGroup]="productForm">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label small fw-bold">Nome Prodotto</label>
              <input type="text" formControlName="title" class="form-control" placeholder="Es: Torta di Mele">
            </div>

            <div class="col-md-6">
              <label class="form-label small fw-bold">Categoria</label>
              <select formControlName="category" class="form-select">
                <option value="">Seleziona...</option>
                <option value="Dolci">Dolci</option>
                <option value="Bevande">Bevande</option>
                <option value="Panificati">Panificati</option>
              </select>
            </div>

            <div class="col-md-4">
              <label class="form-label small fw-bold">Prezzo (€)</label>
              <input type="number" formControlName="price" class="form-control">
            </div>

            <div class="col-md-8">
              <label class="form-label small fw-bold">Impiegato incaricato</label>
              <input type="text" formControlName="employee" class="form-control" placeholder="Nome cognome">
            </div>

            <div class="col-12">
              <label class="form-label small fw-bold">Descrizione</label>
              <textarea formControlName="description" class="form-control" rows="3"></textarea>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer bg-light">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" (click)="productForm.reset()">Annulla</button>
        <button 
  type="button" 
  class="btn btn-primary px-4" 
  [disabled]="productForm.invalid"
  (click)="onSave()" 
  data-bs-dismiss="modal">
  Salva Prodotto
</button>
      </div>
    </div>
  </div>
</div>`
})
export class ProductFormComponent {
  private readonly _fb = inject(FormBuilder);
  @Output() submitted = new EventEmitter<Product>();

  protected readonly productForm = this._fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', [Validators.required]],
    price: [null as number | null, [Validators.required, Validators.min(0.01)]],
    description: ['', [Validators.required]],
    employee: ['', [Validators.required]]
  });

  protected onSave(): void {
    // Validazione e creazione del nuovo prodotto
    if (this.productForm.valid) {
      const val = this.productForm.value;
      
      const newProduct: Product = {
        id: crypto.randomUUID(), 
        title: val.title!.trim(),
        category: val.category!,
        price: +val.price!,
        description: val.description?.trim() || 'Nessuna descrizione',
        employee: val.employee!,
        reviews: []
      };

      // Emissione dell'evento 
      this.submitted.emit(newProduct);
      // Reset del form dopo l'invio
      this.productForm.reset();
      
    }
  }
}