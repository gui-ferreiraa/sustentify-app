import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

interface IAChatResponse {
  success: boolean;
  question: string;
  content: string;
  duration: number;
}

@Injectable({
  providedIn: 'root'
})
export class IAChatService {
  private status$?: Observable<{ successfully: boolean }>;
  private readonly url = environment.ASSISTANT_BASE_URL + '/chat';

  constructor(
    private readonly http: HttpClient
  ) { }

  verify(): Observable<{ successfully: boolean }> {
    if (!this.status$) {
      this.status$ = this.http.get<{ successfully: boolean }>(`${this.url}/verify`).pipe(
        shareReplay(1),
        catchError(error => {
          return throwError(() => new Error('Communication with the server failed!'))
        })
      );
    }

    return this.status$;
  }

  forceVerify(): Observable<{ successfully: boolean }> {
    this.status$ = this.http.get<{ successfully: boolean }>(`${this.url}/verify`).pipe(
      shareReplay(1),
      catchError(error => {
        return throwError(() => new Error('Falha na comunicação com o servidor!'))
      })
    );
    return this.status$;
  }

  sendMessage(message: string): Observable<IAChatResponse> {
    return this.http.get<IAChatResponse>(`${this.url}`, {
      params: new HttpParams().set('message', message)
    });
  }
}
