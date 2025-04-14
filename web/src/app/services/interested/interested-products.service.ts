import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseDto } from '../../core/types/response.dto';
import { REQUIRE_AUTH } from '../../core/interceptors/contexts/authRequire.context';

interface IInterestedProps {
  productId: number;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class InterestedProductsService {
  private readonly apiUrl = '/v1/interested-products/'

  constructor(
    private readonly http: HttpClient
  ) { }

  fetchInterestedCreate(props: IInterestedProps): Observable<IResponseDto> {
    return this.http.post<IResponseDto>(`${this.apiUrl}/${props.productId}`, {
      quantity: props.quantity
    }, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    })
  }
}
