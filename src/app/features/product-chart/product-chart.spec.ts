import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductChartComponent } from './product-chart';

describe('ProductChart', () => {
  let component: ProductChartComponent;
  let fixture: ComponentFixture<ProductChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductChartComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
