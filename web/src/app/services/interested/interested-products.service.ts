import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { IResponseDto } from '../../core/types/response.dto';
import { REQUIRE_AUTH } from '../../core/interceptors/contexts/authRequire.context';
import { IInterestedProduct, IInterestedProductSummary } from '../../core/types/interested-products';
import { InterestStatus } from '../../core/enums/InterestStatus';

interface IInterestedProps {
  productId: number;
  quantity: number;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class InterestedProductsService {
  private readonly apiUrl = '/v1/interested-products'

  constructor(
    private readonly http: HttpClient
  ) { }

  fetchInterestedCreate(props: IInterestedProps): Observable<IResponseDto> {
    return this.http.post<IResponseDto>(`${this.apiUrl}/${props.productId}`, {
      quantity: props.quantity,
      message: props.message,
    }, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    })
  }

  fetchInterestedByProductId(
    productId: number
  ): Observable<IInterestedProductSummary[]> {
    return this.http.get<IInterestedProductSummary[]>(`${this.apiUrl}/product/${productId}`, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    });
  }

  fetchInterestedByCompany(): Observable<IInterestedProductSummary[]> {
    return this.http.get<IInterestedProductSummary[]>(this.apiUrl, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    });
  }

  fetchInterestedDetails(
    interestedId: number,
  ): Observable<IInterestedProduct> {
    return this.http.get<IInterestedProduct>(`${this.apiUrl}/${interestedId}`, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    });
  }

  fetchInterestedDelete(
    interestedId: number
  ): Observable<IResponseDto> {
    return this.http.delete<IResponseDto>(`${this.apiUrl}/${interestedId}`, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    });
  }

  fetchInterestedUpdate(
    interestedId: number,
    status: InterestStatus,
  ): Observable<IResponseDto> {
    return this.http.patch<IResponseDto>(`${this.apiUrl}/${interestedId}`, {
      status
    }, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    });
  }
}
