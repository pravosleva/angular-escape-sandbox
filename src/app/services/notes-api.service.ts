import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NotesApiResponse } from '../models/notes.model';

@Injectable({ providedIn: 'root' })
export class NotesApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'https://pravosleva.pro/express-next-api/code-samples-proxy/api/notes';

  public searchNotes(query: string): Observable<NotesApiResponse> {
    return this.http.get<NotesApiResponse>(this.baseUrl, {
      params: {
        q_title_all_words: query,
        page: '1',
        limit: '10'
      }
    });
  }
}
