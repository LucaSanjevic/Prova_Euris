import { Component, inject, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
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
        <div
          class="modal-header"
          [class.bg-primary]="!productToEdit"
          [class.bg-warning.text-dark]="productToEdit"
        >
          <h5 class="modal-title">
            {{ productToEdit ? 'Modifica Prodotto' : 'Aggiungi Nuovo Prodotto' }}
          </h5>
          <button
            type="button"
            class="btn-close"
            [class.btn-close-white]="!productToEdit"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>

        <div class="modal-body p-4">
          <form [formGroup]="productForm">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label small fw-bold">Nome Prodotto</label>
                <input
                  type="text"
                  formControlName="title"
                  class="form-control"
                  placeholder="Es: Torta di Mele"
                />
              </div>

              <div class="col-md-6">
                <label class="form-label small fw-bold">Categoria</label>
                <select formControlName="category" class="form-select">
                  <option value="">Seleziona...</option>
                  @for (c of categories; track c) {
                    <option [value]="c">{{ c }}</option>
                  }
                </select>
              </div>

              <div class="col-md-4">
                <label class="form-label small fw-bold">Prezzo (€)</label>
                <input type="number" formControlName="price" class="form-control" />
              </div>

              <div class="col-md-8">
                <label class="form-label small fw-bold">Impiegato incaricato</label>
                <input
                  type="text"
                  formControlName="employee"
                  class="form-control"
                  placeholder="Nome cognome"
                />
              </div>

              <div class="col-12">
                <label class="form-label small fw-bold">Descrizione</label>
                <textarea formControlName="description" class="form-control" rows="3"></textarea>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer bg-light">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            (click)="productForm.reset()"
          >
            Annulla
          </button>
          <button
            type="button"
            class="btn btn-primary px-4"
            [disabled]="productForm.invalid"
            (click)="onSave()"
            data-bs-dismiss="modal"
          >
            Salva Prodotto
          </button>
        </div>
      </div>
    </div>
  </div>`,
})
export class ProductFormComponent {
  private readonly _fb = inject(FormBuilder);
  // crea una proprietà di input che può essere un oggetto Product o null, usata per precompilare il form quando si modifica un prodotto esistente
  @Input() productToEdit: Product | null = null;
  // crea un evento di output chiamato "submitted" che emette un oggetto con una proprietà "data" di tipo Product quando il form viene salvato
  @Output() submitted = new EventEmitter<{ data: Product }>();

  // Lista centralizzata delle categorie
  protected categories = [
    'Dolci',
    'Bevande',
    'Panificati',
    'Gelati e Sorbetti',
    'Biscotti',
    'Croissant e Brioche',
    'Cioccolatini e Praline',
    'limone tostato',
  ];

  protected productForm = this._fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    category: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0.01)]],
    description: ['', Validators.required],
    employee: ['', Validators.required],
  });

  ngOnChanges(): void {
    if (this.productToEdit) {
      // si mette in cat la categoria del prodotto
      const cat = this.productToEdit.category || '';
      // riempie il form con i dati del prodotto da modificare, sovrascrivendo solo la categoria con il valore centralizzato
      this.productForm.patchValue({ ...this.productToEdit, category: cat });
    }
  }

  // Metodo chiamato quando si clicca su "Salva Prodotto"
  protected onSave(): void {
    if (this.productForm.valid) {
      // 
      const productData: Product = {
        // prende quello che c'era prima
        ...this.productToEdit,
        // prende quello che c'è nel form, sovrascrivendo i campi modificati
        ...(this.productForm.value as any),
        // in caso di nuovo prodotto, genera un ID univoco, altrimenti mantieni l'ID esistente
        id: this.productToEdit?.id || crypto.randomUUID(),
      };
      // emette l'evento con i dati del prodotto da aggiungere o modificare
      this.submitted.emit({ data: productData });
      // svuota il form dopo l'invio
      this.productForm.reset();
    }
  }
}
