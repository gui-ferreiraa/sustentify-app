import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { CookieService } from '../../services/cookies/cookie.service';
import { REQUIRE_AUTH } from './contexts/authRequire.context';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const cookie = inject(CookieService);
  const requiresAuth = req.context.get(REQUIRE_AUTH);

  if (!requiresAuth) return next(req);

  const token = cookie.getAccessToken();
  const authreq = req.clone({
    withCredentials: true,
    headers: req.headers.set('Authorization', `Bearer ${token}`)
  })

  return next(authreq);
};
