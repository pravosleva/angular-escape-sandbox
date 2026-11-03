import { Component, signal, computed, effect } from '@angular/core';

@Component({
  selector: 'exp-day-2-step-1',
  standalone: true,
  imports: [],
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰️ День 2: Шаг 1 — Сигналы и Эффекты</h3>

      <div class="lab-monitor">
        <p>Поток А (Signal): <strong>{{ streamA() }}</strong></p>
        <p>Поток B (Signal): <strong>{{ streamB() }}</strong></p>
        <hr style="border-color: #444;" />
        <!-- Зависимый computed-узел графа реактивности -->
        <p>Сумма потоков (Computed): <strong style="color: #00bc8c;">{{ sum() }}</strong></p>
      </div>

      <div class="row1">
        <button (click)="incrementA()" class="btn">Увеличить Поток А</button>
        <button (click)="incrementB()" class="btn">Увеличить Поток B</button>
        <button (click)="triggerUnrelatedChange()" class="btn">Мутировать холостой сигнал</button>
      </div>

      <p style="color: #888;">
        *🔬 Логи синхронизации графа реактивности выводятся в Console DevTools.
      </p>
    </div>
  `,
  styles: []
})
export class Day2Step1 {
  // 1. Инициализация источников правды (Producers)
  streamA = signal(10);
  streamB = signal(20);
  unrelatedSignal = signal(0); // Холостой сигнал для проверки изоляции эффекта

  // 2. Направленный граф: computed автоматически выведет зависимости из тела функции (A и B)
  // Пересчитается ТОЛЬКО при изменении streamA или streamB.
  sum = computed(() => {
    console.log('🟢 [Computed Nodes]: Пересчитываю сумму потоков...');
    return this.streamA() + this.streamB();
  });

  constructor() {
    console.log('🏗️ [Constructor]: Компонент Step1 инициализирован.');

    // 3. Деконструкция useEffect. Запускается в контексте внедрения (конструкторе).
    // Автоматически подписывается ТОЛЬКО на те сигналы, которые прочитаны внутри.
    // Никаких ручных массивов зависимостей [deps]!
    effect(() => {
      // Считываем streamA и вычисляемый sum
      const currentA = this.streamA();
      const currentSum = this.sum();

      console.log(`📡 [Effect Triggered]: Сайд-эффект синхронизации. Поток А = ${currentA}, Общая сумма = ${currentSum}`);
      console.log('💡 Заметьте: изменение streamB триггерит этот эффект ОПОСРЕДОВАННО через computed узел sum!');
    });
  }

  incrementA() {
    // Безопасное обновление на основе предыдущего значения
    this.streamA.update(v => v + 1);
  }

  incrementB() {
    this.streamB.update(v => v + 1);
  }

  triggerUnrelatedChange() {
    this.unrelatedSignal.update(v => v + 1);
    console.log(`⚡ [Click]: Изменили холостой сигнал: ${this.unrelatedSignal()}. Проверьте консоль — вызвался ли эффект?`);
  }
}
