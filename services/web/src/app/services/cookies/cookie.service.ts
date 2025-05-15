import { Injectable } from '@angular/core';
import { CookieService as NgxCookie } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class CookieService {
  private readonly accessToken = 'accessToken';
  private readonly refreshToken = 'refreshToken';

  constructor(
    private readonly cookieService: NgxCookie
  ) { }

  getAccessToken() {
    return this.cookieService.get(this.accessToken);
  }

  getRefreshToken() {
    return this.cookieService.get(this.refreshToken);
  }

  setAccessToken(value: string) {
    this.cookieService.set(this.accessToken, value);
  }

  removeAccessToken() {
    this.cookieService.delete(this.accessToken)
  }
}
