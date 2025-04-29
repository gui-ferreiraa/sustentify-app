import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, combineLatest, map, Observable, of } from 'rxjs';
import { ICompany } from '../../core/types/company';
import { CookieService } from '../cookies/cookie.service';
import { REQUIRE_AUTH } from '../../core/interceptors/contexts/authRequire.context';
import { environment } from '../../../environments/environment';

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
  private readonly url = environment.API_BASE_URL + '/auth';

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
    return this.http.post<IResponseDto>(`${this.url}/login`, loginDto);
  }

  verifyEmail(token: string): Observable<ICompany> {
    return this.http.get<ICompany>(`${this.url}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
     });
  }

  getCompanyLogged(): Observable<ICompany | null> {
    const token = this.cookieService.getAccessToken();

    if (!token) {
      this.setCompany(null);
      this.loadedSubject.next(true);
      return new Observable<ICompany | null>(observer => observer.next(null));
    }

    return this.http.get<ICompany>(`${this.url}`, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    }).pipe(
      map(company => {
        this.setCompany(company);
        this.loadedSubject.next(true);
        return company;
      }),
      catchError(() => {
        this.setCompany(null);
        this.loadedSubject.next(true);
        this.logout();
        return of(null);
      })
    );
  }

  logout() {
    this.setCompany(null);

    this.http.get<IResponseDto>(`${this.url}/logout`, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    }).subscribe();

    this.cookieService.removeAccessToken();
  }

  recoverPassword(email: string) {
    return this.http.post(`${this.url}/recover`, { email });
  }

  updatePassword(token: string, password: string) {
    return this.http.patch(`${this.url}/update-password/${token}`, { password });
  }
}
