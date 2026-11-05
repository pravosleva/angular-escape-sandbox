import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Глобальный перехватчик ошибок браузера
    provideBrowserGlobalErrorListeners(),
    // Активируем роутер со сквозным пробросом параметров URL в инпуты
    provideRouter(appRoutes, withComponentInputBinding())
  ]
};
