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

  it('dovrebbe mostrare il titolo del prodotto nel template', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    // Cerchiamo il testo nel titolo della card
    expect(compiled.querySelector('.card-title')?.textContent).toContain('Prodotto Test');
  });

  it('dovrebbe emettere l\'evento di eliminazione al click (senza spyOn)', () => {
    let idEmesso: string | undefined;

    component.delete.subscribe((id: string) => {
      idEmesso = id;
    });

    // Cerchiamo il bottone
    const button = fixture.nativeElement.querySelector('.text-danger'); 
    
    // Verifichiamo che il bottone esista prima di cliccare
    expect(button).toBeTruthy(); 
    
    // Se button esiste (non è null), clicchiamo
    button?.click();

    expect(idEmesso).toBe('1');
  });
});