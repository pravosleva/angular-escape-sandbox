import { Component, input, computed, effect } from '@angular/core';

@Component({
  selector: 'exp-day-4-step-1',
  standalone: true,
  imports: [],
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰 День 4: Шаг 1 — Функциональный роутинг & Component Input Binding</h3>

      <div class="lab-monitor stack1">
        <h4>📡 Монитор параметров навигации URL:</h4>
        <!-- Сигнальные инпуты автоматически извлекают данные из URL рантаймом -->
        <p>Динамический ID процесса (из пути): <strong>{{ id() ?? 'Не указан (/dashboard/:id)' }}</strong></p>
        <p>Поисковый фильтр (из query parameters): <strong>{{ search() ?? 'Отсутствует (?search=...)' }}</strong></p>
      </div>

      <div class="lab-monitor stack1">
        <h4>📊 Вычисляемые метрики (Computed DAG):</h4>
        <p>Текущее состояние графа: <strong>{{ analyticsSummary() }}</strong></p>
      </div>

      <p>
        *🔬 Попробуй изменить URL в браузере вручную, например: <code>/dashboard/101?search=reactive</code>.
        Компонент точечно обновит DOM без тотального ререндера класса.
      </p>
    </div>
  `
})
export class Day4Step1 {
  /**
   * 1. Входящие параметры URL автоматически оборачиваются в readonly-сигналы.
   * Имя свойства строго совпадает со строкой конфигурации в роутах или query-ключом.
   */
  public readonly id = input<string | undefined>();
  public readonly search = input<string | undefined>();

  /**
   * 2. Цепочка вычислений (DAG). Автоматически пересчитывается,
   * когда рантайм Angular обновляет входные сигналы id() или search().
   */
  public readonly analyticsSummary = computed(() => {
    console.log('🟢 [Dashboard Computed]: URL изменился, пересчитываю метрики...');
    const processId = this.id() ? `#${this.id()}` : 'Базовый';
    const query = this.search() ? `с фильтрацией по слову "${this.search()}"` : 'без фильтрации';
    return `Анализирую поток [${processId}] ${query}. Системные ноды стабильны.`;
  });

  constructor() {
    // Трассировка обновлений для лабораторного лога
    effect(() => {
      console.log(`📡 [Dashboard UI Effect]: DOM хирургически изменен. Текущий ID в памяти: ${this.id()}`);
    });
  }
}
