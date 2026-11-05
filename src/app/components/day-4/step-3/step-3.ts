import { Component, signal, computed, inject, effect, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Инструменты интероперабельности Сигналов и RxJS (rxjs-interop)
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

// Операторы RxJS для реализации задержки (debounce) и отмены race conditions (switchMap)
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, startWith, switchMap, tap } from 'rxjs/operators';

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
export class Day4Step3 {
  private readonly notesApi = inject(NotesApiService);

  // 1. Входящие параметры от роутера
  public readonly query = input<string | undefined>();
  public readonly initialNotes = input<NotesApiResponse | null>(null);

  // 2. Локальные сигналы для UI
  public readonly searchQuery = signal<string>('');
  public readonly isSearching = signal<boolean>(false);

  /**
   * 3. Реактивный мост (Финальный монолитный вариант)
   * Вместо ручных флагов мы превращаем initialNotes() в Observable.
   * Если он выдает данные — UI их сразу отобразит. Если пользователь вводит текст — сработает switchMap.
   */
  private readonly apiResponse = toSignal<NotesApiResponse>(
    toObservable(this.searchQuery).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((text) => {
        // Если поле ввода совпадает с параметром из URL, берем готовые данные из резолвера
        if (text === this.query() && this.initialNotes()) {
          return of(this.initialNotes() as NotesApiResponse);
        }

        if (!text.trim()) return of(this.getEmptyResponse());

        this.isSearching.set(true);
        return this.notesApi.searchNotes(text).pipe(
          tap(() => this.isSearching.set(false))
        );
      }),
      // Инициализируем поток актуальным состоянием резолвера на старте приложения
      startWith(this.initialNotes() ?? this.getEmptyResponse())
    ),
    { requireSync: true }
  );

  // 4. Computed-свойства для шаблона остаются без изменений
  public readonly notesList = computed(() => this.apiResponse().data);
  public readonly totalNotesCount = computed(() => this.apiResponse().pagination.totalNotes);

  constructor() {
    /**
     * 5. Эффект синхронизации.
     * Срабатывает один раз, когда роутер заполнил input-свойства.
     */
    effect(() => {
      const urlQuery = this.query();
      if (urlQuery) {
        this.searchQuery.set(urlQuery);
      }
    });
  }

  private getEmptyResponse(): NotesApiResponse {
    return { success: true, data: [], pagination: { totalPages: 0, currentPage: 1, totalNotes: 0 } };
  }
}
