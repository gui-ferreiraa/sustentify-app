import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, switchMap } from 'rxjs';
import { ICompany } from '../../core/types/company';
import { HttpClient, HttpContext } from '@angular/common/http';
import { IResponseDto } from '../../core/types/response.dto';
import { REQUIRE_AUTH } from '../../core/interceptors/contexts/authRequire.context';

@Injectable({
  providedIn: 'root'
})
export class CompaniesService {
  private readonly apiUrl = `/v1/companies`;

  private companySubject = new BehaviorSubject<ICompany>({} as ICompany);
  public company$ = this.companySubject.asObservable();

  constructor(private http: HttpClient) { }

  create(company: Omit<ICompany, 'id'>, file: File) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('company', new Blob([JSON.stringify(company)], { type: 'application/json' }));

    return this.http.post<ICompany>(`${this.apiUrl}`, formData);
  }

  update(
    company: Partial<ICompany>
  ) {
    return this.http.patch<IResponseDto>(`${this.apiUrl}`, company, {
      context: new HttpContext().set(REQUIRE_AUTH, true)
    });
  }

  delete() {}
}
