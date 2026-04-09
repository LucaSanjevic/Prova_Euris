import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;
 
  const apiUrl = 'https://us-central1-test-b7665.cloudfunctions.net/api/stores/ijpxNJLM732vm8AeajMR/products';

  // Configura il TestBed e inietta il servizio e il mock HTTP
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  // Verifica che non ci siano richieste HTTP pendenti dopo ogni test
  afterEach(() => {
    httpMock.verify(); 
  });

  // Test per la mappatura dei dati
  it('should map data correctly', () => {
    // Dati di test che simulano la risposta del server
    const mockResponse = [
      { id: '1', data: { title: 'Test Prodotto', price: 10 } }
    ];

    // Chiama il metodo che effettua la richiesta HTTP
    service.fetchProducts();
    // Controlla che la richiesta sia stata fatta all'URL corretto
    const req = httpMock.expectOne(apiUrl);
    // Simula la risposta del server con i dati di test e sblocca next() dell'observable
    req.flush(mockResponse);

    // Verifica che i dati siano stati mappati correttamente nel signal
    expect(service.products()[0].title).toBe('Test Prodotto');
    expect(service.products()[0].id).toBe('1');
  });

  // Test per l'aggiunta di un prodotto e l'aggiornamento del signal
  it('should add a product (POST) and update the signal', () => {
    const newProductData = { data: { title: 'Nuovo', price: 20 } };
    // Simuliamo l'ID restituito dal server dopo la creazione del prodotto
    const mockId = 'new-id-123';

    // Chiama il metodo per aggiungere un prodotto ma il contenuto si attiverà con flush
    service.addProduct(newProductData).subscribe(product => {
      expect(product.id).toBe(mockId);
      expect(product.title).toBe('Nuovo');
    });

    const req = httpMock.expectOne(apiUrl);
    expect(req.request.method).toBe('POST');
    // Sblocca la chiamata addProduct con l'ID simulato, che attiverà la mappatura e l'aggiornamento del signal
    req.flush(mockId); 
  });

  // Test per la cancellazione di un prodotto e l'aggiornamento del signal
  it('should delete a product (DELETE) and update the signal', () => {
    const productId = '123';
    
    // chiamata al metodo deleteProduct ma il contenuto si attiverà con flush
    service.deleteProduct(productId).subscribe();

    const req = httpMock.expectOne(`${apiUrl}/${productId}`);
    // Verifichiamo che la richiesta sia di tipo DELETE
    expect(req.request.method).toBe('DELETE');
    // Sblocchiamo la chiamata deleteProduct simulando una risposta di successo, che attiverà l'aggiornamento del signal
    req.flush('Deleted successfully'); 

    // Verifichiamo che il prodotto sia stato rimosso dal signal
    expect(service.products().find(p => p.id === productId)).toBeUndefined();
  });

  // Test per la gestione degli errori del server
  it('should handle 500 server error', () => {
    service.fetchProducts();
    const req = httpMock.expectOne(apiUrl);
    
    req.flush('Errore', { status: 500, statusText: 'Server Error' });

    expect(service.isLoading()).toBeFalsy();
    expect(service.products().length).toBe(0);
  });
});