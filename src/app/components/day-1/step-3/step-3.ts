import { Component, signal } from '@angular/core';

interface ProcessItem {
  id: number;
  name: string;
}

@Component({
  selector: 'exp-day-1-step-3',
  standalone: true,
  imports: [], // Встроенный Control Flow (@if, @for) не требует импорта сторонних директив!
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰️ Экспериментальный стенд: Шаг 3 (Control Flow)</h3>

      <div class="row1">
        <button (click)="toggleLoader()" class="btn">Переключить лоадер</button>
        <button (click)="addProcess()" class="btn">Добавить процесс</button>
        <button (click)="clearProcesses()" class="btn">Очистить все</button>
      </div>

      <div class="lab-monitor">
        <!-- 1. Ветвление через @if / @else -->
        @if (isLoading()) {
          <div class="spinner">⏳ [Рантайм]: Сканирование графа зависимостей...</div>
        } @else {
          <div>
            <h4>📋 Активные процессы в песочнице:</h4>

            <ul>
              <!-- 2. Цикл через @for с обязательным трекингом по уникальному ID -->
              <!-- Дополнительно берем контекстные переменные компилятора: $index и $even -->
              @for (item of processes(); track item.id; let idx = $index, isEven = $even) {
                <li [style.color]="isEven ? '#0f0' : '#00bc8c'">
                  [{{ idx }}] ID: {{ item.id }} — Поток: {{ item.name }}
                </li>
              } @empty {
                <!-- 3. Блок @empty автоматически отрендерится, если массив пуст -->
                <li style="color: #ff3333;">📭 [Empty State]: Данные полностью отсутствуют</li>
              }
            </ul>
          </div>
        }
      </div>
    </div>
  `,
})
export class Day1Step3 {
  // Инициализируем реактивные атомы данных (Сигналы)
  isLoading = signal(false);
  processes = signal<ProcessItem[]>([
    { id: 101, name: 'Main-Reactor-Core' },
    { id: 102, name: 'Zoneless-Change-Detector' }
  ]);

  private nextId = 103;

  toggleLoader() {
    // Инвертируем булево значение внутри сигнала
    this.isLoading.update(v => !v);
  }

  addProcess() {
    // В Angular 20+ мутировать массив напрямую нельзя, иммутабельно обновляем сигнал процессов
    this.processes.update(items => [
      ...items,
      { id: this.nextId++, name: `Sub-Routine-${Math.random().toString(36).substring(7)}` }
    ]);
  }

  clearProcesses() {
    this.processes.set([]);
  }
}
