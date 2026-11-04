import { Component, Injectable, inject, signal, computed } from '@angular/core';

/**
 * 1. ГЛОБАЛЬНЫЙ СИНГЛТОН-СТОР (Service-as-a-Store паттерн)
 * providedIn: 'root' гарантирует, что Angular создаст ровно ОДИН инстанс
 * этого класса на все приложение и уничтожит его только при закрытии вкладки.
 */
@Injectable({
  providedIn: 'root'
})
export class SandboxStoreService {
  // Приватное состояние (Инкапсуляция данных)
  private readonly _isEngineOnline = signal<boolean>(true);
  private readonly _subRoutinesCount = signal<number>(5);

  // Публичное состояние в режиме Read-Only
  isEngineOnline = this._isEngineOnline.asReadonly();
  subRoutinesCount = this._subRoutinesCount.asReadonly();

  // Вычисляемое состояние на уровне Стора (Computed Node в ациклическом графе)
  systemStatus = computed(() => {
    console.log('🟢 [Global Store Computed]: Вычисляю системный статус...');
    return this._isEngineOnline()
      ? `⚙️ Рантайм Активен. Процессов в пуле: ${this._subRoutinesCount()}`
      : '🔴 Рантайм Остановлен. Внимание.';
  });

  // Действия (Actions) для изменения состояния
  toggleEngine() {
    this._isEngineOnline.update(state => !state);
  }

  addSubRoutine() {
    if (this._isEngineOnline()) {
      this._subRoutinesCount.update(count => count + 1);
    } else {
      console.warn('⚠️ Невозможно добавить процесс: ядро системы выключено!');
    }
  }
}

/**
 * 2. КОМПОНЕНТ ПУЛЬТА УПРАВЛЕНИЯ (Day3Step2)
 */
@Component({
  selector: 'exp-day-3-step-2',
  standalone: true,
  imports: [],
  // providers: [...] НЕ пишем, иначе мы перезапишем глобальный инстанс локальным!
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰️ День 3: Шаг 2 — Паттерн "Сервис как Стор" (Singleton)</h3>

      <div class="lab-monitor stack1">
        <h4>📊 Монитор Глобального Состояния:</h4>
        <p>Текущий статус: <strong>{{ store.systemStatus() }}</strong></p>
        <p>Ядро онлайн: <strong [style.color]="store.isEngineOnline() ? '#0f0' : '#ff3333'">{{ store.isEngineOnline() }}</strong></p>
      </div>

      <div class="row1">
        <button (click)="store.toggleEngine()" class="btn">1. Переключить Питание Ядра</button>
        <button (click)="store.addSubRoutine()" class="btn">2. Запустить Sub-Routine</button>
      </div>

      <p>
        *🔬 Этот стор полностью изолирован от UI-разметки. Изменение питания ядра не триггерит тяжелые вычисления в других компонентах.
      </p>
    </div>
  `,
})
export class Day3Step2 {
  // Внедряем глобальный стор одной строчкой через inject().
  // Шаблон компонента имеет прямой доступ к readonly сигналам стора.
  protected store = inject(SandboxStoreService);
}
