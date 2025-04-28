import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponseDto } from '../../core/types/response.dto';
import { Observable } from 'rxjs';

interface IMailDto {
  name: string;
  phone: string;
  subject: string;
  message: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private readonly url = '/v1/emails'

  constructor(
    private readonly http: HttpClient
  ) { }

  send(props: IMailDto): Observable<IResponseDto> {
    return this.http.post<IResponseDto>(`${this.url}`, {
      ...props,
    })
  }
}
