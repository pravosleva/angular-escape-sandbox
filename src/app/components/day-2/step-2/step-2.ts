import { Component, signal, computed, input, output } from '@angular/core';

// 1. ДОЧЕРНИЙ КОМПОНЕНТ (Объявляем первым, чтобы родитель мог его импортировать)
@Component({
  selector: 'exp-day-2-step-2-child',
  standalone: true,
  imports: [],
  template: `
    <div class="lab-monitor">
      <h4>👶 Дочерний компонент (Day2Step2Child)</h4>

      <!-- Потребляем сигнальные пропсы как функции -->
      <p>Ядро: <strong style="color: #00bc8c;">{{ coreName() }}</strong></p>
      <p>Частота: <strong>{{ frequency() }} МГц</strong></p>

      <!-- Потребляем вычисляемый узел графа -->
      <p>Производная метрика (Computed): <span>{{ derivedMetric() }}</span></p>

      <button (click)="sendPing()" class="btn">Отправить пинг родителю</button>
    </div>
  `,
  styles: ``
})
export class Day2Step2Child {
  // Сигнальные инпуты (Props нового поколения)
  coreName = input.required<string>(); // Обязательный проп
  frequency = input<number>(2400);     // Опциональный проп с дефолтным значением

  // Аналог useMemo, завязанный строго на инпут coreName
  derivedMetric = computed(() => {
    console.log('🟢 [Child Computed]: Пересчитываю метрику на основе coreName...');
    return `[${this.coreName().toUpperCase()}]—SYS-OK`;
  });

  // Новый компактный примитив для генерации событий наверх (Callbacks/Outputs)
  pingEvent = output<string>();

  sendPing() {
    this.pingEvent.emit(`Пинг из дочернего потока в ${new Date().toLocaleTimeString()}`);
  }
}

//2. РОДИТЕЛЬСКИЙ КОМПОНЕНТ
/**
 * Поскольку у нас standalone-архитектура, и родитель (Day2Step2) рендерит ребенка (Day2Step2Child), они должны знать друг о друге на уровне TS. Правильное правило для одного файла: сначала объявляем дочерний компонент с декоратором, а затем родительский, который импортирует дочерний в свой массив imports.
 *
 * @export
 * @class Day2Step2
 * @typedef {Day2Step2}
 */
@Component({
  selector: 'exp-day-2-step-2',
  standalone: true,
  // КРИТИЧЕСКИ ВАЖНО: Явно импортируем класс ребенка, так как мы в standalone-режиме
  imports: [Day2Step2Child],
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰️ День 2: Шаг 2 — Сигнальные инпуты и События</h3>

      <div class="row1">
        <button (click)="changeCoreName()" class="btn">1. Изменить coreName родителя</button>
        <button (click)="changeFrequency()" class="btn">2. Изменить frequency родителя</button>
      </div>

      <p>Лог событий от ребенка: <span style="color: #aaa;">{{ lastChildLog() }}</span></p>

      <!-- Передаем сигналы родителя в инпуты ребенка через квадратные скобки [prop] -->
      <!-- Слушаем события ребенка через круглые скобки (event) -->
      <exp-day-2-step-2-child
        [coreName]="parentCoreName()"
        [frequency]="parentFrequency()"
        (pingEvent)="onChildPing($event)"
      />
    </div>
  `,
  styles: ``
})
export class Day2Step2 {
  // Состояние родителя (Источники правды)
  parentCoreName = signal('Main-Core');
  parentFrequency = signal(3200);
  lastChildLog = signal('Пока нет сигналов');

  changeCoreName() {
    this.parentCoreName.set(Math.random() > 0.5 ? 'Quantum-Core' : 'Matrix-Unit');
  }

  changeFrequency() {
    this.parentFrequency.update(f => f + 200);
  }

  // Обработчик события от ребенка. Аргумент $event строго типизирован.
  onChildPing(message: string) {
    this.lastChildLog.set(message);
    console.log(`📡 [Parent Engine] Перехвачено событие: ${message}`);
  }
}
