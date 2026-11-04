import { Component, Injectable, inject, signal } from '@angular/core';

/**
 * 1. ИЗОЛИРОВАННЫЙ СЕРВИС (Бизнес-логика / Шина данных)
 * Декоратор @Injectable заявляет рантайму Angular, что этот класс можно внедрять.
 */
@Injectable(
  // providedIn: 'root' НЕ пишем, если нам нужен локальный стейт,
  // привязанный строго к ветке этого компонента, а не глобальный синглтон.
)
export class CustomLoggerService {
  // Реактивный лог, к которому получат доступ все, кто внедрит сервис
  logs = signal<string[]>(['[System]: Инициализация локального инжектора']);

  addLog(message: string) {
    this.logs.update(current => [...current, `[${new Date().toLocaleTimeString()}]: ${message}`]);
  }
}

/**
 * 2. ГЛУБОКО ВЛОЖЕННЫЙ ДОЧЕРНИЙ КОМПОНЕНТ (Day3Step1Child)
 */
@Component({
  selector: 'exp-day-3-step-1-child',
  standalone: true,
  imports: [],
  template: `
    <div class="lab-monitor stack1">
      <h4>👶 Глубокий ребенок (Day3Step1Child)</h4>
      <p style="font-size: 12px; color: #bbb;">
        Я нахожусь на глубине дерева, у меня нет пропсов или колбэков, но я пишу напрямую в логгер.
      </p>
      <button (click)="sendAction()" class="btn">Запустить импульс из ребенка</button>
    </div>
  `,
})
export class Day3Step1Child {
  // Настоящий аналог useContext() в Angular 20+.
  // Функция inject() ищет CustomLoggerService вверх по иерархии инжекторов.
  private logger = inject(CustomLoggerService);

  sendAction() {
    this.logger.addLog('⚡ Импульс сгенерирован внутри Day3Step1Child');
  }
}

/**
 * 3. РОДИТЕЛЬСКИЙ КОМПОНЕНТ (КОНТЕЙНЕР ШАГА)
 */
@Component({
  selector: 'exp-day-3-step-1',
  standalone: true,
  // Импортируем дочерний компонент в скоуп standalone шаблона
  imports: [Day3Step1Child],
  // РЕГИСТРАЦИЯ ПРОВАЙДЕРА: Создает инстанс сервиса на уровне этого компонента и его детей.
  // Это точечный аналог <Context.Provider value={...}>, но без раздувания HTML-дерева!
  providers: [CustomLoggerService],
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰️ День 3: Шаг 1 — Движок DI и Функция inject()</h3>

      <button (click)="addParentLog()" class="btn">Добавить лог из родителя</button>

      <!-- Вывод логов, которые пишут и родитель, и ребенок в один инстанс класса -->
      <div class="lab-monitor stack1">
        <h4>📊 Локальный логгер инжектора (NodeInjector):</h4>
        <ul style="list-style: none; padding: 0; margin: 0; font-size: 13px;">
          @for (log of logger.logs(); track $index) {
            <li>{{ log }}</li>
          }
        </ul>
      </div>

      <!-- Никаких пропсов и колбэков! Ребенок сам возьмет логгер из контекста DI -->
      <exp-day-3-step-1-child />
    </div>
  `,
})
export class Day3Step1 {
  // Внедряем тот же самый инстанс логгера, который унаследует и ребенок
  protected logger = inject(CustomLoggerService);

  addParentLog() {
    this.logger.addLog('🏗️ Действие зафиксировано в родителе Step1');
  }
}
