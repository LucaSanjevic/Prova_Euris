import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Dashboard } from './dashboard';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ProductService } from '../../services/product.service';
import { Component } from '@angular/core';

// 1. Creiamo un mock del componente che NON ha file esterni
@Component({
  selector: 'app-dashboard',
  standalone: true,
  template: '<div>Mock</div>' // HTML inline, niente errore!
})
class DashboardMock {}

describe('Dashboard', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // Usiamo Dashboard (l'originale) ma lo "sovrascriviamo" subito
      imports: [Dashboard],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ProductService
      ]
    })
    // 2. Forza Angular a usare il template inline PRIMA di ogni altra cosa
    .overrideComponent(Dashboard, {
      set: { templateUrl: '', template: '<div>Mock</div>', styleUrls: [] }
    })
    .compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(Dashboard);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});