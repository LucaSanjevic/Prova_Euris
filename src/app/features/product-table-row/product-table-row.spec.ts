import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTableRowComponent } from './product-table-row';

describe('ProductTableRow', () => {
  let component: ProductTableRowComponent;
  let fixture: ComponentFixture<ProductTableRowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductTableRowComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductTableRowComponent);
    component = fixture.componentInstance;
    // DEVI dare un valore all'input prima di detectChanges
  component.item = { title: 'Test', price: 10, category: 'A', reviews: [], employee: '', description: '' };
  fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
