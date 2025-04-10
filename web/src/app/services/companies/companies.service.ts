import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ICompany } from '../../core/types/company';
import { HttpClient } from '@angular/common/http';
import { IResponseDto } from '../../core/types/response.dto';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private readonly apiUrl = `/v1/companies`;

  private companySubject = new BehaviorSubject<ICompany>({} as ICompany);
  public company$ = this.companySubject.asObservable();

  constructor(private http: HttpClient) { }

  create(company: ICompany) {
    return this.http.post<IResponseDto>(`${this.apiUrl}`, company);
  }
}
