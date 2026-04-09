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

    // Subscribe all'evento delete per catturare l'id emesso
    component.delete.subscribe((id: string) => {
      emittedId = id;
    });

    // Prende il pulsante di eliminazione dal template
    const button = fixture.nativeElement.querySelector('.text-danger');

    // Verifica che il pulsante esista prima di cliccarlo
    expect(button).toBeTruthy();

    // Se button esiste (non è null), clicchiamo
    button?.click();

    expect(emittedId).toBe('1');
  });
});