import { Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
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
    if (this.productForm.valid) {
      const val = this.productForm.value;
      
      const newProduct: Product = {
        id: crypto.randomUUID(), // Qui diamo l'ID univoco
        title: val.title!.trim(),
        category: val.category!,
        price: +val.price!,
        description: val.description?.trim() || 'Nessuna descrizione',
        employee: val.employee!,
        reviews: []
      };

      this.submitted.emit(newProduct);
      this.productForm.reset();
      
      // Chiudiamo il modal programmaticamente (opzionale se usi data-bs-dismiss)
    }
  }
}