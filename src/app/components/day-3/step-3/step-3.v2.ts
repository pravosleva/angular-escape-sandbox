import { Component, signal as angularSignal, effect as angularEffect, inject as angularInject, DestroyRef, Injectable } from '@angular/core';
import { ReactiveEngine } from '@pravosleva/reactive-engine';

/**
 * АРХИТЕКТУРНЫЙ ШАГ 1: ИЗОЛИРОВАННЫЙ СТОР БИЗНЕС-ЛОГИКИ
 *
 * Декоратор @Injectable без { providedIn: 'root' } заявляет движку DI Angular,
 * что данный стор является локальным (Scoped). Он родится вместе с компонентом
 * и будет уничтожен фреймворком из памяти, исключая утечки.
 */
@Injectable()
export class ExternalEngineStore {
  // Внедряем изолированный экземпляр движка, предоставленный на уровне компонента
  private readonly _engine = angularInject(ReactiveEngine);

  // Инициализируем реактивные ноды строго через инстанс движка [1]
  private readonly _isExternalEngineOnline = this._engine.signal<boolean>(true, 'external-engine:online');
  private readonly _externalSubRoutinesCount = this._engine.signal<number>(3, 'external-engine:routines');

  // Генерируем безопасные Read-Only интерфейсы
  public readonly isOnline = this._isExternalEngineOnline;
  public readonly routinesCount = this._externalSubRoutinesCount;

  // Строим направленный ациклический граф (DAG) вычислений через инстанс [0.1.1, 1]
  public readonly systemStatus = this._engine.computed(() => {
    console.log('🟢 [External Core Computed]: Пересчитываю статус внешнего графа...');
    return this._isExternalEngineOnline.value
      ? `⚡ Внешнее ядро Активно. Процессов запущено: ${this._externalSubRoutinesCount.value}`
      : '🔴 Внешнее ядро Отключено. Системный сбой.';
  }, 'external-engine:computed:status');

  public toggleEngine(): void {
    this._isExternalEngineOnline.value = !this._isExternalEngineOnline.value;
  }

  public addSubRoutine(): void {
    if (this._isExternalEngineOnline.value) {
      this._externalSubRoutinesCount.value += 1;
    } else {
      console.warn('⚠ Запрещено: Внешнее ядро находится в режиме Offline!');
    }
  }
}

/**
 * АРХИТЕКТУРНЫЙ ШАГ 2: UI-КОМПОНЕНТ КАК ДЕКЛАРАТИВНАЯ ФАБРИКА
 */
@Component({
  selector: 'exp-day-3-step-3',
  standalone: true,
  // РЕГИСТРАЦИЯ ПРОВАЙДЕРОВ: Создаем локальные инстансы движка и стора для этой ветки UI
  providers: [
    // 1. Конфигурируем ReactiveEngine через фабричную функцию
    {
      provide: ReactiveEngine,
      useFactory: () => new ReactiveEngine({ logger: { isEnabled: true } })
    },
    // 2. Стор автоматически подхватит этот настроенный инстанс через inject()
    ExternalEngineStore
  ],
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰 День 3: Шаг 3 — Интеграция с @pravosleva/reactive-engine (DI-Way)</h3>

      <div class="lab-monitor stack1">
        <h4>📊 Монитор Внешнего Реактивного Движка:</h4>
        <p>Текущий статус: <strong>{{ uiState().status }}</strong></p>
        <p>Ядро онлайн: <strong [style.color]="uiState().isOnline ? '#0f0' : '#ff3333'">{{ uiState().isOnline }}</strong></p>
      </div>

      <div class="row1">
        <button (click)="store.toggleEngine()" class="btn">1. Переключить Внешнее Питание</button>
        <button (click)="store.addSubRoutine()" class="btn">2. Добавить Внешний Процесс</button>
      </div>

      <p>
        *🔬 Код полностью переведен на изолированные инстансы ReactiveEngine и декларативное управление через DI Angular.
      </p>
    </div>
  `,
})
export class Day3Step3 {
  // Внедряем инстансы движка и стора из DI-контекста
  private readonly _engine = angularInject(ReactiveEngine);
  public readonly store = angularInject(ExternalEngineStore);

  // Нативный сигнальный узел Angular для связывания данных с шаблоном
  protected readonly uiState = angularSignal({
    status: this.store.systemStatus.value,
    isOnline: this.store.isOnline.value
  });

  constructor() {
    const destroyRef = angularInject(DestroyRef);

    // Создаем синхронизационный эффект через изолированный инстанс движка [1]
    const unsubscribeExternalEffect = this._engine.effect(() => {
      this.uiState.set({
        status: this.store.systemStatus.value,
        isOnline: this.store.isOnline.value
      });
    }, 'angular-bridge:sync-effect');

    // Безопасная очистка ресурсов при уничтожении компонента
    destroyRef.onDestroy(() => unsubscribeExternalEffect());
  }

  // Нативная диагностика для проверки отсутствия холостых ререндеров
  private readonly _initDiagnostics = (() => {
    angularEffect(() => {
      const state = this.uiState();
      console.log(`📡 [Angular UI Effect]: Шаблон точечно обновлен. Онлайн: ${state.isOnline}`);
    });
  })();
}
