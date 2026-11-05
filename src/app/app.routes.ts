import { Routes } from '@angular/router';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('./components/main-layout/main-layout').then(m => m.MainLayoutComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard-layout/dashboard-layout').then(m => m.DashboardLayoutComponent)
  },
  {
    path: 'dashboard/:id',
    loadComponent: () => import('./components/dashboard-layout/dashboard-layout').then(m => m.DashboardLayoutComponent)
  }
];
