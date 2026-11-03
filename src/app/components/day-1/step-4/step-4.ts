import { Component, signal, computed } from '@angular/core';

interface ProcessItem {
  id: number;
  name: string;
}

@Component({
  imports: [],
  selector: 'exp-day-1-step-4',
  styles: ``,
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰️ Финальный стенд Шага 4: Итоговый эксперимент</h3>

      <!-- 1. Вызов тяжелой функции напрямую в шаблоне -->
      <div class="lab-monitor">
        ⚙️ Тяжёлое вычисление в шаблоне:
        <strong style="color: #ff3333;">{{ runHeavyCalculation() }}</strong>
      </div>

      <!-- 2. Вызов оптимизированного computed-сигнала (аналог useMemo) -->
      <div class="lab-monitor">
        🧠 Оптимизированный computed() граф (useMemo-way):
        <strong>{{ optimizedValue() }}</strong>
      </div>

      <div class="row1">
        <button (click)="toggleLoader()" class="btn">1. Переключить лоадер (Триггер Сигнала)</button>
        <button (click)="addProcess()" class="btn">2. Добавить процесс (Изменение списка)</button>
      </div>

      <div class="lab-monitor">
        @if (isLoading()) {
          <div>⏳ Сканирование рантайма...</div>
        } @else {
          <div>
            <h4>📋 Процессы:</h4>
            <ul>
              @for (item of processes(); track item.id) {
                <li>ID: {{ item.id }} — {{ item.name }}</li>
              }
            </ul>
          </div>
        }
      </div>
    </div>
  `,
})

export class Day1Step4 {
  // Источники правды (Producers)
  isLoading = signal(false);
  processes = signal<ProcessItem[]>([
    { id: 101, name: 'Zoneless-Core' }
  ]);

  private nextId = 102;

  // Аналог useMemo в React. Собирается в ациклический граф зависимостей.
  // Вызовется повторно ТОЛЬКО если изменится сигнал processes().
  // Переключение сигнала isLoading() этот граф вообще не затронет!
  optimizedValue = computed(() => {
    console.log('🟢 [Computed Graph] Recalculating optimizedValue... (Зависимость: processes)');
    return `Всего процессов: ${this.processes().length}`;
  });

  constructor() {
    console.log('🏗️ [Constructor] Фабрика компонента отработала ОДИН раз!');
  }

  /**
   * Тяжёлая функция, симулирующая проблему React без useMemo
   */
  runHeavyCalculation(): string {
    console.log('🔴 [Heavy Calc] Рантайм Angular зашёл в тело тяжелой функции!');
    return 'Результат #42';
  }

  toggleLoader() {
    this.isLoading.update(v => !v);
  }

  addProcess() {
    this.processes.update(items => [
      ...items,
      { id: this.nextId++, name: `Sub-Routine-${this.nextId}` }
    ]);
  }
}
