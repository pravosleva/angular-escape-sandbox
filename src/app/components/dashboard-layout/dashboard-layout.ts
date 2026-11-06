import { Component, input } from '@angular/core';
import { Day4Step1 } from '../day-4/step-1/step-1.v2';
import { Day4Step2 } from '../day-4/step-2/step-2';
import { Day5Step1 } from '../day-5/step-1/step-1';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [Day4Step1, Day4Step2, Day5Step1],
  template: `
    <div class="sandbox-root">
      <h1>Day 4</h1>
      <h2>Hello Routes</h2>
      <div class="stack2">
        <!-- (v1) Явно передаем значения сигналов родителя в инпуты ребенка -->
        <!-- <exp-day-4-step-1 [id]="id()" [search]="search()" /> -->
        <!-- (v2) -->
        <exp-day-4-step-1 />
        <exp-day-4-step-2 />
        <exp-day-5-step-1 />
      </div>
    </div>
  `
})
export class DashboardLayoutComponent {
  // NOTE: (v1) Теперь родитель принимает данные из URL
  // public readonly id = input<string | undefined>();
  // public readonly search = input<string | undefined>();
}

/* NOTE: В примере Day4Step1 источником правды для данных (id и search) стал URL-адрес в браузере, которым управляет глобальный сервис Router

Флаг withComponentInputBinding() — это автоматический мост,
созданный разработчиками Angular. Он работает по принципу:
«Вижу компонент на первой линии роута -> смотрю его input() -> если имя совпадает с параметром URL, автоматически записываю туда значение»

Это фундаментальное правило работы withComponentInputBinding() в Angular.
*/
