import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { IProduct, IProductPagination, IProductResponse, IProductSummary } from '../../core/types/product';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Category } from '../../core/enums/category.enum';
import { Condition } from '../../core/enums/condition.enum';
import { Material } from '../../core/enums/material.enum';
import { isValidEnumValue } from '../../core/utils/isValidEnumValue';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly apiUrl = `/v1/products`;

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
    let params = new HttpParams()
      .set('size', size)
      .set('page', page)

      if (category && isValidEnumValue(Category, category)) {
        params = params.set('category', category);
      }

      if (condition && isValidEnumValue(Condition, condition)) {
        params = params.set('condition', condition);
      }

      if (material && isValidEnumValue(Material, material)) {
        params = params.set('material', material);
      }

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

      console.log(params);

      return this.http.get<IProductResponse>(`${this.apiUrl}/trending`, {
        params,
      }).pipe(
        tap(response => {
          this.productsSubject.next(response.content);
          this.productsPaginationSubject.next(response);
        })
      )
  }

  fetchProductDetails(productId: number): Observable<IProduct> {
    if (isNaN(productId)) {
      throw new Error('productid inválido')
    }

    return this.http.get<IProduct>(`${this.apiUrl}/${productId}`);
  }
}
