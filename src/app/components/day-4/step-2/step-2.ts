import { Component, signal, computed, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Инструменты интероперабельности Сигналов и RxJS (rxjs-interop)
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

// Операторы RxJS для реализации задержки (debounce) и отмены race conditions (switchMap)
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

// Типизированный API-сервис и интерфейсы данных
import { NotesApiService } from '../../../services/notes-api.service';
import { NotesApiResponse } from '../../../models/notes.model';

@Component({
  selector: 'exp-day-4-step-2',
  standalone: true,
  imports: [CommonModule, FormsModule],
    template: `
    <div class="lab-sandbox dark stack1">
      <h3>🅰 День 4: Шаг 2 — Живой поиск (Debounce + switchMap)</h3>
      <div class="lab-monitor stack1">
        <!-- 1. Панель ввода с двусторонним связыванием [(ngModel)] -->
        <div class="control-panel">
          <input
            type="text"
            placeholder="Поиск по статьям..."
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            class="input"
          />
        </div>

        <!-- 2. Индикатор асинхронного фетчинга на сигналах -->
        @if (isSearching()) {
          <div class="status loading">
            📡 Лаборатория pravosleva.pro: Выполняется сетевой поиск...
          </div>
        }

        <!-- 3. Вывод результатов и метаданных графа -->
        <div class="results-panel stack1">
          <h4>📊 Всего найдено заметок: {{ totalNotesCount() }}</h4>

          <ul class="notes-list stack1">
            @for (item of notesList(); track item.original._id; let idx = $index) {
              <li class="note-card stack1 lab-monitor">
                <span class="index">[{{ idx + 1 }}]</span>
                <div class="note-content stack1">
                  <b>{{ item.original.title }}</b>
                  <p>{{ item.brief }}</p>
                  <small class="slug">Slug: <code>{{ item.slug }}</code></small>
                </div>
              </li>
            } @empty {
              @if (!isSearching()) {
                <li class="empty-state">
                  🔬 Наблюдение: Введите запрос или по вашему запросу ничего не найдено.
                </li>
              }
            }
          </ul>
        </div>
      </div>

      <p class="lab-hint">
        *🔬 Наблюдение для React Senior: При вводе символов Angular не вызывает повторно класс <code>Day4Step2</code>
        и не диффит Virtual DOM. Рантайн точечно изменяет исключительно текстовые ноды и список <code>&lt;li&gt;</code>.
      </p>
    </div>
  `,
  styles: []
})
export class Day4Step2 {
  // 1. Внедряем API-сервис новейшим функциональным способом через inject()
  private readonly notesApi = inject(NotesApiService);

  // 2. Локальный сигнал для реактивного связывания со строкой ввода (инпутом)
  public readonly searchQuery = signal<string>('');

  // 3. Сигнал-флаг для индикации состояния сетевого фетчинга данных
  public readonly isSearching = signal<boolean>(false);

  /**
   * 4. Реактивный асинхронный мост (toSignal + toObservable).
   * Превращает изменения строки ввода в стрим, гасит дребезг (debounce),
   * отменяет предыдущие зависшие запросы (switchMap) и возвращает результат в Сигнал.
   */
  private readonly apiResponse = toSignal<NotesApiResponse | null>(
    toObservable(this.searchQuery).pipe(
      debounceTime(300), // Ждем 300мс затишья перед отправкой на сервер
      distinctUntilChanged(), // Игнорируем повторные триггеры, если текст не изменился
      tap((text) => {
        console.log(`📡 [Day 4 Sandbox]: Инициализирован поиск для query: "${text}"`);
        this.isSearching.set(true); // Включаем лоадер перед запросом
      }),
      switchMap((text) => {
        // Если инпут пустой, не спамим сервер, возвращаем "пустой" валидный ответ
        if (!text.trim()) {
          return of({ success: true, data: [], pagination: { totalPages: 0, currentPage: 1, totalNotes: 0 } });
        }
        // switchMap автоматически сделает abort() для XHR/Fetch в браузере при новом вводе
        return this.notesApi.searchNotes(text);
      }),
      tap(() => {
        this.isSearching.set(false); // Выключаем лоадер по завершении потока
      })
    ),
    { initialValue: null } // Начальное состояние до первого ввода пользователя
  );

  /**
   * 5. Computed DAG (Направленный Ациклический Граф).
   * Вытаскивает чистый массив заметок из API-ответа. Автоматически пересчитается,
   * когда Сигнал apiResponse() получит новые данные из RxJS-моста.
   */
  public readonly notesList = computed(() => {
    return this.apiResponse()?.data ?? [];
  });

  /**
   * 6. Computed для получения метаданных пагинации
   */
  public readonly totalNotesCount = computed(() => {
    return this.apiResponse()?.pagination?.totalNotes ?? 0;
  });

  constructor() {
    // Лабораторный эффект для трассировки хирургического обновления DOM в консоли
    effect(() => {
      console.log(`🟢 [Day 4 UI Effect]: Список обновлен. Найдено элементов: ${this.totalNotesCount()}`);
    });
  }
}
