import { Component, inject, ComponentRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LAB_LOGGER, LabLogger, AdvancedLabLogger } from '../../../tokens/logger.token';

/**
 * 1. ДОЧЕРНИЙ ВИДЖЕТ (Экспериментальная нода)
 */
@Component({
  selector: 'exp-day-5-child-node',
  standalone: true,
  template: `
    <div class="lab-monitor stack1">
      <b>🔬 Дочерняя Нода Инжекции</b>
      <p>Используемый префикс логгера: <strong style="color: #e74c3c;">{{ logger.prefix }}</strong></p>
      <button (click)="runExperiment()" class="btn">
        Отправить отчет в логгер
      </button>
    </div>
  `
})
export class Day5ChildNode {
  /**
   * Магия Angular 20+: Мы внедряем контракт интерфейса по токену-ключу!
   * Дочерний компонент изолирован. Ему всё равно, стандартный это логгер или AdvancedLabLogger.
   */
  protected readonly logger = inject(LAB_LOGGER);

  public runExperiment(): void {
    this.logger.log('Экспериментальный процесс запущен успешно.');
  }
}

/**
 * 2. РОДИТЕЛЬСКИЙ КОМПОНЕНТ (Day5Step1)
 */
@Component({
  selector: 'exp-day-5-step-1',
  standalone: true,
  imports: [CommonModule, Day5ChildNode],
  template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰️ День 5: Шаг 1 — InjectionToken как Абстрактная Фабрика</h3>

      <div class="lab-monitor stack1">
        <p>Родительский контейнер переопределяет фабрику логов для этой ветки DOM-дерева.</p>

        <!-- Дочерний компонент получит кастомный логгер из NodeInjector родителя -->
        <exp-day-5-child-node />
      </div>
    </div>
  `,
  // ИСПОЛЬЗУЕМ ДИНАМИЧЕСКИЙ USEFACTORY (Паттерн Абстрактная Фабрика)
  providers: [
    {
      provide: LAB_LOGGER, // При запросе этого токена...
      useFactory: (): LabLogger => {
        // Здесь может быть любая сложная логика рантайма:
        // проверка флагов окружения, чтение стейта, или генерация уникальных инстансов.
        const isLabBeta = true;

        if (isLabBeta) {
          return new AdvancedLabLogger('⚠️ [Beta-Factory-Node #109]');
        }

        // Фолбек к дефолтной реализации
        return {
          prefix: '🟢 [Fallback Production]',
          log: (msg) => console.log(`🟢 [Fallback]: ${msg}`)
        };
      }
    }
  ]
})
export class Day5Step1 {}
