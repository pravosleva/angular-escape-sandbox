import { Component, computed, effect, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';

@Component({
  selector: 'exp-day-4-step-1',
  standalone: true,
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰 День 4: Шаг 1 (v2) — Извлечение URL через DI ActivatedRoute & toSignal</h3>
      <div class="lab-monitor stack1">
        <p>ID процесса: <strong>{{ id() ?? 'Не указан' }}</strong></p>
        <p>Поиск: <strong>{{ search() ?? 'Отсутствует' }}</strong></p>
        <p>Аналитика: <strong>{{ analyticsSummary() }}</strong></p>
      </div>
    </div>
  `
})
export class Day4Step1 {
  private readonly route = inject(ActivatedRoute);

  public readonly id = toSignal(
    this.route.paramMap.pipe(map(params => params.get('id') ?? undefined))
  );

  public readonly search = toSignal(
    this.route.queryParamMap.pipe(map(params => params.get('search') ?? undefined))
  );

  public readonly analyticsSummary = computed(() => {
    const processId = this.id() ? `#${this.id()}` : 'Базовый';
    const query = this.search() ? `фильтр: ${this.search()}` : 'без фильтра';
    return `Поток [${processId}] (${query})`;
  });

  constructor() {
    effect(() => {
      console.log(`ID из ActivatedRoute: ${this.id()}`);
    });
  }
}
