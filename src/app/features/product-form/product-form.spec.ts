import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form';
import { ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../models/product.model';

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [ProductFormComponent, ReactiveFormsModule],
  })

  .overrideComponent(ProductFormComponent, {
  set: { template: '<form></form>', styleUrls: [] }
})
  .compileComponents(); 
  
  fixture = TestBed.createComponent(ProductFormComponent);
  component = fixture.componentInstance;
  fixture.detectChanges();
});

  it('should be invalid when empty', () => {
    // Usiamo (component as any) per accedere alla proprietà protected
    expect((component as any).productForm.valid).toBe(false);
  });

  it('should be valid when all fields are filled correctly', () => {
    const form = (component as any).productForm;
    form.patchValue({
      title: 'Torta di mele',
      category: 'Dolci',
      price: 12,
      employee: 'Luca',
      description: 'Descrizione test'
    });
    expect(form.valid).toBe(true);
  });

  it('should emit tsubmittedhe correct data on save', () => {
    let emitted = false;
    let receivedProduct: any = null;

    // Subscribe all'Output per catturare l'evento emesso
    component.submitted.subscribe(p => {
      // quando si attiva OnSave, dovrebbe emettere un prodotto con i dati del form
      emitted = true;
      receivedProduct = p;
    });

    // Compila il form
    const form = (component as any).productForm;
    form.patchValue({
      title: 'Prodotto Test',
      category: 'Dolci',
      price: 10,
      employee: 'Admin',
      description: 'Test'
    });

    // Chiama il metodo onSave per simulare il click sul pulsante di salvataggio
    (component as any).onSave();

    // Verifiche finali
    expect(emitted).toBe(true);

    // Il prodotto emesso dovrebbe avere i dati corretti
    const title = receivedProduct.data ? receivedProduct.data.title : receivedProduct.title;
    expect(title).toBe('Prodotto Test');
  });
});