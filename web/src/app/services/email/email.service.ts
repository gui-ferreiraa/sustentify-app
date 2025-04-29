import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IResponseDto } from '../../core/types/response.dto';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

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
  private readonly url = environment.API_BASE_URL + '/emails'

  constructor(
    private readonly http: HttpClient
  ) { }

  send(props: IMailDto): Observable<IResponseDto> {
    return this.http.post<IResponseDto>(`${this.url}`, {
      ...props,
    })
  }
}
