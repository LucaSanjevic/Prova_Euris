import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Per sicurezza, puliamo le richieste dopo ogni test
  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

it('dovrebbe caricare i prodotti tramite GET', async () => {
  // 1. Il mock deve avere la struttura richiesta dal mapping: id + data
  const mockRawData = [
    { 
      id: '1', 
      data: { title: 'Test 1', price: 10, category: 'Dolci', reviews: [] } 
    }
  ];

  // 2. L'oggetto di risposta DEVE avere la proprietà "list"
  const mockResponse = { 
    list: mockRawData 
  };

  service.fetchProducts();

  const req = httpMock.expectOne(request => request.url.includes('/products'));
  expect(req.request.method).toBe('GET');

  // 3. Inviamo la struttura corretta
  req.flush(mockResponse);

  // Aspettiamo che i segnali si aggiornino
  await new Promise(resolve => setTimeout(resolve, 0));

  // 4. Ora il mapping funzionerà e i prodotti saranno 1
  expect(service.products().length).toBe(1);
  expect(service.products()[0].title).toBe('Test 1');
});



});