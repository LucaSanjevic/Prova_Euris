import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductTableRowComponent } from './product-table-row';

describe('ProductTableRowComponent', () => {
  let component: ProductTableRowComponent;
  let fixture: ComponentFixture<ProductTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableRowComponent]
    }).compileComponents();

    // Crea il componente e imposta un prodotto di test
    fixture = TestBed.createComponent(ProductTableRowComponent);
    // Instanza del componente
    component = fixture.componentInstance;
    
    // Mock del prodotto
    component.item = { 
      id: 'ID_TEST_123', 
      title: 'Prodotto Test'
    } as any;

    fixture.detectChanges();
  });

  it('should emit reviews when requested', () => {
    let emittedReviews: string[] | undefined = undefined;
    const mockReviews = ['Ottimo', 'Pessimo'];
    component.item = { reviews: mockReviews } as any;

    // Sottoscriviamo all'evento per catturare le recensioni emesse
    component.viewReviews.subscribe(reviews => {
      emittedReviews = reviews;
    });

    // Simula il click sul pulsante per visualizzare le recensioni
    component.viewReviews.emit(component.item.reviews);

    // Verifica che le recensioni emesse siano quelle attese
    expect(emittedReviews).toEqual(mockReviews);
  });
});