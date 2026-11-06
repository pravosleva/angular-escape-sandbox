import { InjectionToken, inject } from '@angular/core';

// 1. Интерфейс контракта (в React мы бы просто надеялись на duck-typing)
export interface LabLogger {
  log(message: string): void;
  readonly prefix: string;
}

// 2. Создаем сам токен. Он выступает уникальным ключом для движка DI
export const LAB_LOGGER = new InjectionToken<LabLogger>('LAB_LOGGER', {
  providedIn: 'root', // Доступен везде по умолчанию (Tree-shakable)
  factory: () => {
    // Фабрика по умолчанию: если никто не переопределил токен выше по дереву инжекторов,
    // Angular автоматически создаст стандартный консольный логгер.
    return {
      prefix: '🟢 [Default Core]',
      log: (msg) => console.log(`🟢 [Default Core]: ${msg}`)
    };
  }
});

// Альтернативный продукт для NodeInjector
export class AdvancedLabLogger implements LabLogger {
  constructor(public readonly prefix: string) {}

  log(message: string): void {
    console.warn(`${this.prefix} (Рантайм-трассировка): ${message}`);
  }
}
