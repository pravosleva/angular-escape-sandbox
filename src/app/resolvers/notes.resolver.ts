import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { NotesApiService } from '../services/notes-api.service';
import { NotesApiResponse } from '../models/notes.model';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export const notesResolver: ResolveFn<NotesApiResponse | null> = (route, state) => {
  const notesApi = inject(NotesApiService);

  // Извлекаем динамический параметр из пути (например, /day-4/step-2/re)
  // или берем значение по умолчанию 'bash'
  const initialQuery = route.paramMap.get('query') ?? 'bash';

  console.log(`📡 [Day 4 Resolver]: Запуск предзагрузки для слова "${initialQuery}"...`);

  return notesApi.searchNotes(initialQuery).pipe(
    catchError((error) => {
      console.error('🔴 [Day 4 Resolver]: Ошибка предзагрузки данных:', error);
      // Возвращаем null, чтобы приложение не упало, а компонент сам обработал пустой стейт
      return of(null);
    })
  );
};
