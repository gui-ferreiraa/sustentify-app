import { HttpInterceptorFn } from '@angular/common/http';
import { BLOCK_REQUIRE } from './contexts/blockRequire.context';
import { throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

export const blockRequestInterceptor: HttpInterceptorFn = (req, next) => {
  const requireContext = req.context.get(BLOCK_REQUIRE);

  if (environment.makeRequest) return next(req);
  if (!requireContext) return next(req);

  return throwError(() => new Error('Requisitions not in operation!'))
};
