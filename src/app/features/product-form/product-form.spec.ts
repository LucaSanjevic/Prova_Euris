import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductFormComponent } from './product-form';

describe('ProductForm', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductFormComponent],
    }).overrideComponent(ProductFormComponent, {
    set: { templateUrl: '', template: '<form></form>', styleUrls: [] }
  })
    .compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
