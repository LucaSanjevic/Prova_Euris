import { Routes } from '@angular/router';
import { ProductChartComponent } from './features/product-chart/product-chart';


export const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard)
    },
    { path: 'analytics', component: ProductChartComponent },
    {
        path: '**',
        redirectTo: 'dashboard'
    }
];
