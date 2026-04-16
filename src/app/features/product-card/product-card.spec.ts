import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from './product-card';

describe('ProductCard', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductCardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;

    // Mock dei dati del prodotto
    component.item = {
      id: '1',
      title: 'Prodotto Test',
      price: 25,
      category: 'Bevande',
      description: 'Descrizione test',
      employee: 'Mario',
      reviews: []
    };
    fixture.detectChanges();
  });

  it('should display the product title in the template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Controlla che il titolo del prodotto sia presente nel template
    expect(compiled.querySelector('.card-title')?.textContent).toContain('Prodotto Test');
  });

  it('should emit the delete event on click', () => {
  let emittedId: string | undefined;
  // Sottoscrivi all'evento delete per catturare l'id emesso
  component.delete.subscribe((id) => (emittedId = id));
  // Seleziona il pulsante di eliminazione
  const deleteBtn = fixture.nativeElement.querySelector('.btn-outline-danger');
  // Controlla che il pulsante esista prima di cliccarlo
  expect(deleteBtn).not.toBeNull();
  // Clicca sul pulsante di eliminazione
  deleteBtn.click();
  // Verifica che l'id emesso corrisponda all'id del prodotto
  expect(emittedId).toBe(component.item.id);
});

});