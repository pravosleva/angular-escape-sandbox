import { Component } from '@angular/core';

@Component({
  imports: [],
  // 1. Полная независимость. Компонент сам является модулем (как файлы в React/Next.js)
  standalone: true,
  selector: 'exp-day-1-step-2',
  styleUrl: './step-2.css',
  templateUrl: './step-2.html',
})
export class Step2 {
  // Локальный стейт компонента (обычное свойство класса)
  counter = 0;

  constructor() {
    // Вызовется ровно ОДИН раз за всю жизнь компонента
    console.log('🏗️ [Constructor] Angular: Фабрика компонента инициализирована!');
  }

  /**
   * Тяжёлая функция (аналог функции без useMemo в React)
   */
  runHeavyCalculation(): string {
    console.log('🔴 [Heavy Calc] Выполняю тяжёлые вычисления в теле класса...');
    return 'Результат #42';
  }

  /**
   * Клик по первой кнопке
   */
  incrementCounter() {
    this.counter++;
    console.log(`⚡ [Click] counter изменен напрямую. Текущее значение в классе: ${this.counter}`);
    console.log('🤔 Проверьте UI: изменилась ли цифра на экране? (Спойлер: в Zoneless-режиме — нет!)');
  }

  /**
   * Клик по второй кнопке (эмуляция forceUpdate / жесткого триггера)
   */
  forceTriggerDetection() {
    console.log('🔮 [Force Update] Пытаемся заставить Angular проверить дерево...');
    // В Zoneless приложении без использования Сигналов этот метод просто отработает,
    // но Angular не пойдет перечитывать класс, потому что граф зависимостей пуст!
  }
}
