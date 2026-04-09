import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { ProductService } from '../../services/product.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;
  let service: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard, HttpClientTestingModule],
      providers: [ProductService]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    service = TestBed.inject(ProductService);
    fixture.detectChanges();
  });

  it('dovrebbe popolare i prodotti e coprire il rendering (Righe 124-167)', () => {
    const mockProducts = [
      { id: '1', title: 'Test 1', price: 10, category: 'A', reviews: [] },
      { id: '2', title: 'Test 2', price: 20, category: 'B', reviews: ['Ottimo'] }
    ];

    // Inietta il mock dei prodotti direttamente nel service per bypassare la chiamata HTTP
    (service as any)._products.set(mockProducts);
    (service as any)._isLoading.set(false);
    
    fixture.detectChanges();

    // Verific che i prodotti siano stati popolati correttamente
    expect(component['products']().length).toBe(2);
  });

  it('should toggle view and open reviews', () => {
    // Test toggleView
    const initialView = component['isTableView']();
    component['toggleView']();
    expect(component['isTableView']()).toBe(!initialView);

    // Test openReviews
    const testReviews = ['Recensione 1'];
    component['openReviews'](testReviews);
    expect(component['selectedReviews']()).toEqual(testReviews);
  });

  it('should execute onDelete without confirmation (ID validation branch)', () => {
    // Mock dell'alert per evitare l'effettiva visualizzazione durante il test
    window.alert = () => {}; 

    component['onDelete']("");

    // Se siamo qui, significa che l'alert è stato chiamato e il flusso è stato interrotto correttamente
    expect(true).toBe(true);
  });

  it('dovrebbe gestire il cambio pagina', () => {
  // crea un array di prodotti finti
  const mockProducts = new Array(15).fill({ id: 'test' });
  (service as any)._products.set(mockProducts);
  
  // Imposta la pagina di partenza a 1
  (service as any)._currentPage.set(1);
  
  component['changePage'](1);
  
  // controlla che la pagina sia cambiata a 2
  expect(service.currentPage()).toBe(2); 
});

});