import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  imports: [
    // Обязательно добавляем это для работы маршрутизации в app.html
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
  ],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly title = signal('angular-escape-sandbox');
}
