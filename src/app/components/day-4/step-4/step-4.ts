import { Component, signal, model, inject, input, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet, RouterLink, RouterLinkActive, Routes } from '@angular/router';
import { NotesApiResponse } from '../../../models/notes.model';
import { Injectable } from '@angular/core';

/**
 * 2. ЛОКАЛЬНЫЙ СЕРВИС СОСТОЯНИЯ (Step4StateService)
 * Выступает мостом для двусторонней связи между родителем и ленивыми детьми,
 * когда они разделены границами роутера <router-outlet>.
 */
@Injectable()
export class Step4StateService {
  // Единый источник правды для уровня, доступный по всей цепочке дочернего DI
  public readonly level = signal<number>(42);
  // Общий буфер для сохранения данных резолвера родителя
  public readonly initialNotes = signal<NotesApiResponse | null>(null);
}

/**
 * 3. КОНФИГУРАЦИЯ ДОЧЕРНИХ МАРШРУТОВ (STEP_4_ROUTES)
 * Экспортируемые пути для ленивой загрузки. В app.routes.ts мы подключим их
 * через loadChildren: () => import('./components/day-4/step-4/step-4').then(m => m.STEP_4_ROUTES)
 */
export const STEP_4_ROUTES: Routes = [
  {
    path: '',
    // По умолчанию дочерняя точка монтирования пуста, отображается только разметка родителя
    loadComponent: () => Day4Step4,
    // КРИТИЧЕСКИЙ ФИКС: Объявляем провайдер на уровне маршрута!
    // Теперь инстанс сервиса создается один раз для всей ветки путей
    // и не уничтожается при монтировании/демонтировании Day4Step4Child.
    providers: [Step4StateService],
    children: [
      {
        path: 'child',
        // Лениво загружаем ребенка при переходе на /day-4/step-4/child
        loadComponent: () => Day4Step4Child
      }
    ]
  }
];

/**
 * 1. ЛЕНИВЫЙ ДОЧЕРНИЙ КОМПОНЕНТ (Day4Step4Child)
 * Компонент монтируется роутером внутри <router-outlet> родителя.
 * Он умеет работать как с двусторонней моделью, так и отображать данные из резолвера.
 */
@Component({
  selector: 'exp-day-4-step-4-child',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="lab-monitor stack1">
      <h4>👶 Дочерний пульт навигации (Day4Step4Child)</h4>

      <!-- Явно связываем инпут с единственным источником правды в сервисе -->
      <p>
        Редактировать уровень (Инпут ребенка):
        <input
          class="input"
          type="number"
          [ngModel]="state.level()"
          (ngModelChange)="onLevelChange($event)"
        />
      </p>

      <div>
        <button (click)="incrementLevel()" class="btn">
          Форсировать +10 из ребенка
        </button>
      </div>

      <div class="lab-monitor stack1">
        <code>📦 Данные предзагрузки от Родительского Резолвера:</code>
        <p>Всего доступно заметок в кэше: <strong>{{ totalNotes() }}</strong></p>
        <a routerLink="../" style="color: #2ecc71; font-size: 13px;">← Вернуться на главный пульт</a>
      </div>
    </div>
  `,
  styles: ``
})
export class Day4Step4Child {
  // 1. Внедряем единый инстанс сервиса, созданный роутом
  protected readonly state = inject(Step4StateService);

  // 2. Читаем данные резолвера напрямую из общего сервиса (избегаем пустых инпутов)
  public readonly totalNotes = computed(() => this.state.initialNotes()?.pagination?.totalNotes ?? 0);

  /**
   * 3. Перехватываем событие изменения инпута из шаблона.
   * Вместо эффектов мы явно отправляем мутацию в сервис, когда пользователь
   * физически печатает в инпуте ребенка.
   */
  public onLevelChange(newValue: number): void {
    this.state.level.set(newValue);
  }

  public incrementLevel(): void {
    // Форсированное обновление на +10 напрямую мутирует единый источник правды
    this.state.level.update(v => v + 10);
  }
}

/**
 * 4. РОДИТЕЛЬСКИЙ КОМПОНЕНТ (Day4Step4)
 */
@Component({
  selector: 'exp-day-4-step-4',
  standalone: true,
  // Подключаем FormsModule для инпута родителя и Router инструменты для вложенных путей
  imports: [CommonModule, FormsModule, RouterOutlet, RouterLink, RouterLinkActive],
  // Регистрируем локальный стейт-сервис в иерархии инжекторов компонента.
  // Это делает инстанс Step4StateService доступным для Day4Step4 и всех его дочерних роутов.
  // providers: [Step4StateService],
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰️ День 4: Шаг 5 — Двустороннее связывание + Вложенный роутинг</h3>

      <div class="lab-monitor stack1">
        <p>Текущий уровень в Системе Родителя:
          <strong style="color: #3498db;">{{ state.level() }}</strong>
        </p>

        <p>
          Редактировать уровень (Инпут родителя):
          <input
            type="number"
            [ngModel]="state.level()"
            (ngModelChange)="state.level.set($event)"
            class="input"
          />
        </p>

        <div class="row1">
          <button (click)="resetLevel()" class="btn">
            Сбросить в 0 из родителя
          </button>

          <!-- Навигационная ссылка на ленивый дочерний маршрут -->
          <a
            routerLink="child"
            routerLinkActive="active-link"
            class="btn"
            style="background: #34495e; color: #fff; text-decoration: none; border-radius: 24px;"
          >
            🚀 Открыть дочерний пульт (/child)
          </a>
        </div>
      </div>

      <!-- ТОЧКА МОНТИРОВАНИЯ ВЛОЖЕННОГО РОУТИНГА (Аналог <Outlet /> из React) -->
      <!-- Роутер лениво скомпилирует и вставит сюда Day4Step4Child при переходе по ссылке -->
      <router-outlet />
    </div>
  `,
  styles: [`
    .active-link { background-color: #27ae60 !important; font-weight: bold; }
  `]
})
export class Day4Step4 {
  // Внедряем наш изолированный DI-мост состояния
  protected readonly state = inject(Step4StateService);

  // Принимаем входящие данные предзагрузки от глобального резолвера
  public readonly initialNotes = input<NotesApiResponse | null>(null);

  constructor() {
    // Наполняем сервис данными резолвера, как только они прилетают в инпут родителя
    effect(() => {
      this.state.initialNotes.set(this.initialNotes());
    });
  }

  public resetLevel(): void {
    this.state.level.set(0);
  }
}
