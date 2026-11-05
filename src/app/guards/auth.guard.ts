import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Лабораторная заглушка авторизации.
  // В реальном приложении здесь будет inject(AuthService).isLoggedIn()
  const isAuthenticated = true;

  console.log(`🛡 [Day 4 Guard]: Проверяю доступ к ${state.url}...`);

  if (!isAuthenticated) {
    console.warn('🔴 [Day 4 Guard]: Доступ запрещен. Редирект на главную.');
    // Возвращаем UrlTree для декларативного редиректа
    return router.createUrlTree(['/']);
  }

  console.log('🟢 [Day 4 Guard]: Доступ разрешен.');
  return true;
};
