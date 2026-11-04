import { Component, signal as angularSignal, effect as angularEffect, inject as angularInject, DestroyRef } from '@angular/core';
// Импортируем методы глобального инстанса внешнего реактивного движка
import { signal as coreSignal, computed as coreComputed, effect as coreEffect } from '@pravosleva/reactive-engine';

/**
 * INSIGHT 1/3: ИЗОЛИРОВАННЫЙ ВНЕШНИЙ СТОР (Бизнес-логика вне Angular)
 *
 * Этот класс полностью независим от экосистемы Angular и UI-рендеринга.
 * Он использует глобальный инстанс @pravosleva/reactive-engine, формируя
 * синхронный направленный ациклический граф (DAG) для управления состоянием.
 */
export class ExternalEngineStore {
  // Приватные реактивные атомы (Producers внешнего графа)
  private readonly _isExternalEngineOnline = coreSignal<boolean>(true, 'external-engine:online');
  private readonly _externalSubRoutinesCount = coreSignal<number>(3, 'external-engine:routines');

  // Публичные свойства для безопасного чтения (Read-Only интерфейс)
  public readonly isOnline = this._isExternalEngineOnline;
  public readonly routinesCount = this._externalSubRoutinesCount;

  /**
   * Вычисляемый узел внешнего графа (Аналог useMemo / computed).
   * Автоматически трекает зависимости внутри замыкания благодаря движку ядра.
   */
  public readonly systemStatus = coreComputed(() => {
    console.log('🟢 [External Core Computed]: Пересчитываю статус внешнего графа...');
    return this._isExternalEngineOnline.value
      ? `⚡ Внешнее ядро Активно. Процессов запущено: ${this._externalSubRoutinesCount.value}`
      : '🔴 Внешнее ядро Отключено. Системный сбой.';
  }, 'external-engine:computed:status');

  /**
   * Изменение состояния (Action) — переключение питания
   */
  public toggleEngine(): void {
    this._isExternalEngineOnline.value = !this._isExternalEngineOnline.value;
  }

  /**
   * Изменение состояния (Action) — добавление процесса с валидацией
   */
  public addSubRoutine(): void {
    if (this._isExternalEngineOnline.value) {
      this._externalSubRoutinesCount.value += 1;
    } else {
      console.warn('⚠ Запрещено: Внешнее ядро находится в режиме Offline!');
    }
  }
}

/**
 * INSIGHT 2/3: ANGULAR COMPONENT И МОСТ РЕАКТИВНОСТИ (АДАПТЕР)
 *
 * Компонент-адаптер для Zoneless-режима Angular 20+, синхронизирующий
 * внешние Computed-ноды со стандартными сигналами Angular.
 */
@Component({
  selector: 'exp-day-3-step-3',
  standalone: true,
  // Полноценный HTML-шаблон для вывода (интегрируется в метаданные @Component во 2-й части)
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰 День 3: Шаг 3 — Интеграция с @pravosleva/reactive-engine</h3>

      <div class="lab-monitor stack1">
        <h4>📊 Монитор Внешнего Реактивного Движка:</h4>
        <p>Текущий статус: <strong>{{ uiState().status }}</strong></p>
        <p>Ядро онлайн: <strong [style.color]="uiState().isOnline ? '#0f0' : '#ff3333'">{{ uiState().isOnline }}</strong></p>
      </div>

      <div>
        <button (click)="store.toggleEngine()" class="btn">1. Переключить Внешнее Питание</button>
        <button (click)="store.addSubRoutine()" class="btn">2. Добавить Внешний Процесс</button>
      </div>

      <p>
        *🔬 Стенд демонстрирует работу стороннего Directed Acyclic Graph (DAG) без VDOM-диффинга в Zoneless Angular.
      </p>
    </div>
  `,
})
export class Day3Step3 {
  public readonly store = new ExternalEngineStore();
  protected readonly uiState = angularSignal({
    status: this.store.systemStatus.value,
    isOnline: this.store.isOnline.value
  });

  constructor() {
    const destroyRef = angularInject(DestroyRef);
    const unsubsribeExternalEffect = coreEffect(() => {
      this.uiState.set({
        status: this.store.systemStatus.value,
        isOnline: this.store.isOnline.value
      });
    }, 'angular-bridge:sync-effect');

    destroyRef.onDestroy(() => unsubsribeExternalEffect());
  }

  /**
   * INSIGHT 3/3: ЛАБОРАТОРНЫЙ ЭФФЕКТ И СТИЛИЗАЦИЯ СТЕНДА
   *
   * Данная секция завершает файл, инкапсулируя внутренний отладочный эффект
   * нативного графа Angular для демонстрации отсутствия лишних ререндеров,
   * а также содержит изолированные CSS-стили песочницы.
   */

  // Дополнение к логике класса Day3Step3 для трассировки изменений
  private readonly _initDiagnostics = (() => {
    // Нативный эффект Angular изолированно следит за мостом uiState()
    angularEffect(() => {
      const state = this.uiState();
      console.log(`📡 [Angular UI Effect]: Шаблон точечно обновлен. Онлайн: ${state.isOnline}`);
    });
  })();
}
