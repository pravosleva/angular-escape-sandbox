import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { notesResolver } from './resolvers/notes.resolver';

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
  },
  {
    path: 'day-4/step-3',
    // 1. Идеальный Lazy Loading standalone-компонента из коробки
    loadComponent: () => import('./components/day-4/step-3/step-3').then(m => m.Day4Step3),

    // 2. Подключаем функциональную защиту
    canActivate: [authGuard],

    // 3. Подключаем предзагрузку данных
    resolve: {
      initialNotes: notesResolver
    }
  },
  {
    // Альтернативный роут с динамическим параметром поиска в URL
    path: 'day-4/step-3/:query',
    loadComponent: () => import('./components/day-4/step-3/step-3').then(m => m.Day4Step3),
    canActivate: [authGuard],
    resolve: {
      initialNotes: notesResolver
    }
  },
];
