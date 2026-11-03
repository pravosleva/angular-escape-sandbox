import { Component, signal, model } from '@angular/core';
import { FormsModule } from '@angular/forms'; // КРИТИЧЕСКИ ВАЖНО: для работы [(ngModel)] с инпутами

/**
 * 1. ДОЧЕРНИЙ КОМПОНЕНТ (Day2Step3Child)
 */
@Component({
  selector: 'exp-day-2-step-3-child',
  standalone: true,
  // Импортируем FormsModule локально, чтобы оживить [(ngModel)] в шаблоне ребенка
  imports: [FormsModule],
  template: `
    <div class="lab-monitor stack1">
      <h4>👶 Дочерний пульт (Day2Step3Child)</h4>

      <!-- Двустороннее связывание модели с нативным инпутом через [(ngModel)] -->
      <p>
        Редактировать уровень (Инпут ребенка):
        <input type="number" [(ngModel)]="level" style="width: 60px; padding: 4px; background: #222; color: #fff; border: 1px solid #444;" />
      </p>

      <div>
        <button (click)="incrementLevel()" class="btn">Форсировать +10 из ребенка</button>
      </div>
    </div>
  `,
  styles: ``
})
export class Day2Step3Child {
  // Вместо input() или output() создаем единый примитив model()
  // Он автоматически создает входящий сигнал level() и исходящее событие levelChange
  level = model<number>(0);

  incrementLevel() {
    // Модель ведет себя как обычный Сигнал: её можно читать через () и мутировать через .update()
    this.level.update(v => v + 10);
  }
}

/**
 * 2. РОДИТЕЛЬСКИЙ КОМПОНЕНТ (Day2Step3)
 */
@Component({
  selector: 'exp-day-2-step-3',
  standalone: true,
  // Импортируем ребенка и FormsModule для инпута в самом родителе
  imports: [Day2Step3Child, FormsModule],
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰️ День 2: Шаг 3 — Двустороннее связывание через model()</h3>

      <div class="lab-monitor">
        <p>Текущий уровень в Системе Родителя: <strong style="color: #3498db; font-size: 18px;">{{ parentLevel() }}</strong></p>

        <p>
          Редактировать уровень (Инпут родителя):
          <input type="number" [(ngModel)]="parentLevel" style="width: 60px; padding: 4px; background: #222; color: #fff; border: 1px solid #444;" />
        </p>
        <button (click)="resetLevel()" class="btn">Сбросить в 0 из родителя</button>
      </div>

      <!-- ИСПОЛЬЗУЕМ «БАНАН В КОРОБКЕ» [(level)] -->
      <!-- Связываем сигнал родителя напрямую с моделью ребенка. Никаких колбэков! -->
      <exp-day-2-step-3-child [(level)]="parentLevel" />
    </div>
  `,
  styles: ``
})
export class Day2Step3 {
  // Источник правды в родителе
  parentLevel = signal(42);

  resetLevel() {
    this.parentLevel.set(0);
  }
}
