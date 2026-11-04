import { Component, effect as angularEffect, inject as angularInject, Injectable } from '@angular/core';
import { AbstractService } from '@pravosleva/reactive-engine';
import { ReactiveEngine as ReactiveEngine4Angular } from '@pravosleva/reactive-engine/angular';

/**
 * АРХИТЕКТУРНЫЙ ШАГ 1: ИЗОЛИРОВАННАЯ БИЗНЕС-ЛОГИКА (Ядро/Сервис)
 *
 * Наследуемся от AbstractService, который поставляется ядром.
 * Класс чист от импортов UI-фреймворков и оперирует только сигналами самого движка.
 */
@Injectable()
export class ExternalEngineStore extends AbstractService {
  // Инициализируем реактивные ноды ядра через встроенное свойство this.engine
  private readonly _isExternalEngineOnline = this.engine.signal<boolean>(true, 'external-engine:online');
  private readonly _externalSubRoutinesCount = this.engine.signal<number>(3, 'external-engine:routines');

  public readonly isOnline = this._isExternalEngineOnline;
  public readonly routinesCount = this._externalSubRoutinesCount;

  // Направленный ациклический граф (DAG) вычислений на стороне ядра
  public readonly systemStatus = this.engine.computed(() => {
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
 * АРХИТЕКТУРНЫЙ ШАГ 2: КОМПОНЕНТ С БЕСШОВНЫМ АДАПТЕРОМ
 */
@Component({
  selector: 'exp-day-3-step-3',
  standalone: true,
  providers: [
    // Инициализируем именно Angular-версию движка с включенным логгером
    {
      // Инструкция для DI-движка, в которой ты объясняешь ему: «Как именно нужно создавать объекты, если этот компонент (или его дети) попросят их через функцию inject()»
      // `provide: ReactiveEngine4Angular` - это «Токен-Ключ»; provide — это уникальный идентификатор (ключ в Map), по которому Angular будет искать зависимость в будущем.
      provide: ReactiveEngine4Angular, // Передана физическая функция-конструктор класса
      // useFactory — это «Рецепт создания» с кастомными настройками
      // useFactory (фабрика) — это функция-инструкция, которая говорит Angular: «Не пытайся создавать этот объект автоматически. Каждый раз, когда кто-то просит этот токен, просто запусти мою функцию и возьми то, что она вернет»
      // Рантайм Angular выполнит этот метод ровно один раз при инициализации компонента, создаст настроенный инстанс движка с включенным логгером и сохранит его в контексте этой ветки DOM-дерева
      useFactory: () => new ReactiveEngine4Angular({ logger: { isEnabled: true } })
    },
    ExternalEngineStore
  ],
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰 День 3: Шаг 3 — Бесшовная интеграция через Адаптер (.use)</h3>

      <div class="lab-monitor stack1">
        <h4>📊 Монитор через Нативные Angular Signals:</h4>
        <p>Текущий статус: <strong>{{ systemStatus() }}</strong></p>
        <p>Ядро онлайн: <strong [style.color]="isOnline() ? '#0f0' : '#ff3333'">{{ isOnline() }}</strong></p>
      </div>

      <div>
        <button (click)="store.toggleEngine()" class="btn">1. Переключить Внешнее Питание</button>
        <button (click)="store.addSubRoutine()" class="btn">2. Добавить Внешний Процесс</button>
      </div>

      <p>
        *🔬 Код очищен от бойлерплейта. Метод .use() автоматически связал два графа реактивности в Zoneless рантайме.
      </p>
    </div>
  `,
})
export class Day3Step3 {
  // 1. Внедряем Angular-версию реактивного движка
  // Когда в любой части компонента или сервиса ты пишешь:
  private readonly _engine = angularInject(ReactiveEngine4Angular);
  // ...Angular берет класс ReactiveEngine4Angular как строку-ключ, идет в свою карту провайдеров и смотрит:
  // «Так, мне прилетел запрос на ключ ReactiveEngine4Angular. Какое правило создания у меня для него записано?..»

  // 2. Внедряем наш сервис бизнес-логики
  public readonly store = angularInject(ExternalEngineStore);

  /**
   * 3. МАГИЯ АДАПТЕРА: Превращаем внешние сигналы ядра в нативные Angular Signals.
   * Метод .use() вызывается в фазе инициализации класса, поэтому он под капотом
   * безопасно связывается с жизненным циклом компонента Angular.
   */
  public readonly isOnline = this._engine.use(this.store.isOnline);
  public readonly systemStatus = this._engine.use(this.store.systemStatus);

  // Нативная диагностика для проверки точечных обновлений DOM
  private readonly _initDiagnostics = (() => {
    angularEffect(() => {
      console.log(`📡 [Angular UI Effect]: Шаблон точечно обновлен. Статус: "${this.systemStatus()}"`);
    });
  })();
}
