import { Component, signal } from '@angular/core';
import { Day1Step2 } from '../day-1/step-2/step-2';
import { Day1Step3 } from '../day-1/step-3/step-3';
import { Day1Step4 } from '../day-1/step-4/step-4';
import { Day2Step1 } from '../day-2/step-1/step-1';
import { Day2Step2 } from '../day-2/step-2/step-2';
import { Day2Step3 } from '../day-2/step-3/step-3';
import { Day3Step1 } from '../day-3/step-1/step-1';
import { Day3Step2 } from '../day-3/step-2/step-2';
import { Day3Step3 } from '../day-3/step-3/step-3';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  // 2. Регистрируем все импортированные standalone-компоненты
  imports: [
    Day1Step2, Day1Step3, Day1Step4,
    Day2Step1, Day2Step2, Day2Step3,
    Day3Step1, Day3Step2, Day3Step3
  ],
  template: `
    <div class="sandbox-root">
      <h1>Day 1</h1>
      <!-- Теперь сигнал существует и успешно отрендерится рантаймом -->
      <h2>Hello {{ title() }}</h2>
      <div class="stack2">
        <exp-day-1-step-2 />
        <exp-day-1-step-3 />
        <exp-day-1-step-4 />
      </div>

      <h1>Day 2</h1>
      <h2>Hello signals</h2>
      <div class="stack2">
        <exp-day-2-step-1 />
        <exp-day-2-step-2 />
        <exp-day-2-step-3 />
      </div>

      <h1>Day 3</h1>
      <h2>Hello DI</h2>
      <div class="stack2">
        <exp-day-3-step-1 />
        <exp-day-3-step-2 />
        <exp-day-3-step-3 />
      </div>
    </div>
  `
})
export class MainLayoutComponent {
  // 3. Объявляем недостающий реактивный атом данных (Сигнал)
  public readonly title = signal('angular-escape-sandbox');
}
