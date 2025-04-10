import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';
import { ICompany } from '../../core/types/company';
import { CookieService } from '../cookies/cookie.service';

interface IResponseDto {
  name: string;
  email: string;
  accessToken: string;
}

interface ILoginDto {
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `/v1/auth`

  private companySubject = new BehaviorSubject<ICompany | null>(null);
  public company$ = this.companySubject.asObservable();

  private loadedSubject = new BehaviorSubject<boolean>(false);
  public loaded$ = this.loadedSubject.asObservable();

  public isAuthenticated$ = combineLatest([
    this.company$,
    this.loaded$
  ]).pipe(
    map(([company, loaded]) => loaded && !!company)
  );

  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService
  ) { }

  setCompany(company: ICompany | null) {
    this.companySubject.next(company);
  }

  login(loginDto: ILoginDto) {
    return this.http.post<IResponseDto>(`${this.apiUrl}/login`, loginDto);
  }

  loadCompanyFromToken() {
    const token = this.cookieService.getAccessToken();

    if (!token) {
      this.setCompany(null);
      this.loadedSubject.next(true);
      return;
    };

    this.http.get<ICompany>(`${this.apiUrl}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next: (company) => {
        this.setCompany(company);
        this.loadedSubject.next(true);
      },
      error: (err) => {
        this.setCompany(null);
        this.loadedSubject.next(true);
        this.cookieService.removeAccessToken();
      }
    });
  }

  logout() {
    const token = this.cookieService.getAccessToken();

    this.setCompany(null);
    this.http.get<IResponseDto>(`${this.apiUrl}/logout`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }).subscribe({
      next(value) {
      },
    });
    this.cookieService.removeAccessToken();
  }

}
