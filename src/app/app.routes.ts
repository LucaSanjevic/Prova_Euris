import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { ProductChartComponent } from './features/product-chart/product-chart';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'chart', component: ProductChartComponent },
  { path: '**', redirectTo: 'dashboard' }
];