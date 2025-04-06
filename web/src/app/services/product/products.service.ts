import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IProductPagination, IProductResponse, IProductSummary } from '../../core/types/product';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  private productsSubject = new BehaviorSubject<IProductSummary[]>([]);
  public products$ = this.productsSubject.asObservable();

  private productsPaginationSubject = new BehaviorSubject<IProductPagination>({} as IProductPagination);
  public productsPagination$ = this.productsPaginationSubject.asObservable();

  constructor(private http: HttpClient) { }

  fetchProducts(
    size: number = 5,
    page: number = 0,
    category?: string,
    condition?: string,
    material?: string
  ): Observable<IProductResponse> {
    const params = new HttpParams()
      .set('size', size)
      .set('page', page)

    if (category) params.set('category', category);
    if (condition) params.set('condition', condition);
    if (material) params.set('material', material);

    return this.http.get<IProductResponse>(this.apiUrl, {
      params,
    }).pipe(
      tap(response => {
        this.productsSubject.next(response.content);
        this.productsPaginationSubject.next(response);
      })
    )
  }

  fetchProductsTrending(
    size: number,
    page: number
  ) {
    const params = new HttpParams()
      .set('size', size)
      .set('page', page)

      return this.http.get<IProductResponse>(this.apiUrl, {
        params,
      }).pipe(
        tap(response => {
          this.productsSubject.next(response.content);
          this.productsPaginationSubject.next(response);
        })
      )
  }
}
