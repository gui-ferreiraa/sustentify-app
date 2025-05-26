import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

interface IAChatResponse {
  success: boolean;
  question: string;
  content: string;
  duration: number;
}

interface Company {
  name: string;
  department: string;
  interestedValue: string;
  interestedLabel: string;
  productsGenerated: string;
  description: string;
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

  sendQuestion(question: string): Observable<IAChatResponse> {
    return this.http.post<IAChatResponse>(`${this.url}/message`, {
      question
    }, {
      headers: new HttpHeaders().set('Content-Length', question.length.toString())
    });
  }

  async sendQuestionStream(question: string, onChunk: (chunk: string) => void): Promise<void> {
    const response = await fetch(`${this.url}/message/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Content-Length': question.length.toString()
      },
      body: JSON.stringify({ question })
    });

    if (!response.ok || !response.body) {
      console.error('Erro na requisição:', response.statusText);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  }

  async sendRecommendationStream(company: Company, onChunk: (chunk: string) => void): Promise<void> {
    const response = await fetch(`${this.url}/recommendation/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream',
        'Content-Length': company.name.length.toString() +
          company.department.length.toString() +
          company.interestedLabel.length.toString() +
          company.interestedValue.length.toString() +
          company.productsGenerated.length.toString() +
          company.description.length.toString()
      },
      body: JSON.stringify({ company })
    });

    if (!response.ok || !response.body) {
      console.error('Erro na requisição:', response.statusText);
      return;
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder('utf-8');

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value, { stream: true });
      onChunk(chunk);
    }
  }
}
