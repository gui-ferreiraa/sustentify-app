import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
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

  create(company: Omit<ICompany, 'id'>) {
    return this.http.post<IResponseDto>(`${this.apiUrl}`, company);
  }

  update(
    id: number,
    company: Partial<ICompany>
  ) {
    return this.http.patch<IResponseDto>(`${this.apiUrl}/${id}`, company, {
      context: new HttpContext().set(REQUIRE_AUTH, true)
    });
  }

  delete() {}
}
