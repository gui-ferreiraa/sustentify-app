import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { IProduct, IProductImage, IProductPagination, IProductResponse, IProductSummary } from '../../core/types/product';
import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { REQUIRE_AUTH } from '../../core/interceptors/contexts/authRequire.context';
import { IResponseDto } from '../../core/types/response.dto';
import { environment } from '../../../environments/environment';

interface IProductServiceParams {
  size: number;
  page: number;
  category?: string,
  condition?: string,
  material?: string
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private readonly url = environment.API_BASE_URL + `/products`;

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

      if (category) {
        params = params.set('category', category);
      }

      if (condition) {
        params = params.set('condition', condition);
      }

      if (material) {
        params = params.set('material', material);
      }

    return this.http.get<IProductResponse>(this.url, {
      params,
    }).pipe(
      tap(response => {
        this.productsSubject.next(response.content);
        this.productsPaginationSubject.next(response);
      }),
      catchError(error => {
        return throwError(() => new Error('Falha na comunicação com o servidor!'))
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

      return this.http.get<IProductResponse>(`${this.url}/trending`, {
        params,
      }).pipe(
        tap(response => {
          this.productsSubject.next(response.content);
          this.productsPaginationSubject.next(response);
        })
      )
  }

  fetchProductsRelated(props: IProductServiceParams): Observable<IProductResponse> {
    let params = new HttpParams()
      .set('size', props.size)
      .set('page', props.page)

      if (props.category) {
        params = params.set('category', props.category);
      }

      if (props.condition) {
        params = params.set('condition', props.condition);
      }

      if (props.material) {
        params = params.set('material', props.material);
      }

    return this.http.get<IProductResponse>(this.url, {
      params,
    }).pipe(
      tap(response => {
        this.productsSubject.next(response.content);
        this.productsPaginationSubject.next(response);
      })
    )
  }

  fetchProductDetails(productId: string): Observable<IProduct> {
    return this.http.get<IProduct>(`${this.url}/${productId}`);
  }

  fetchProductCreate(product: Omit<IProduct, 'id' | 'disposalDate'>) {
    return this.http.post<IProduct>(this.url, product, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    })
  }

  fetchProductsByCompany(): Observable<IProductResponse> {
    return this.http.get<IProductResponse>(`${this.url}/my`, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    })
  }

  fetchProductUpdate(product: Omit<IProduct, 'disposalDate' | 'thumbnail' | 'images'>): Observable<IResponseDto> {

    return this.http.patch<IResponseDto>(`${this.url}/${product.id}`, {
      ...product,
    }, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    })
  }

  fetchProductDelete(productId: string): Observable<IResponseDto> {
    return this.http.delete<IResponseDto>(`${this.url}/${productId}`, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    })
  }

  fetchUploadThumbnail(productId: string, file: File): Observable<IResponseDto> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<IResponseDto>(`${this.url}/${productId}/thumbnail`, formData, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    })
  }

  fetchUploadImages(productId: string, files: File[]): Observable<IResponseDto> {
    const formData = new FormData();

    files.forEach(file => formData.append('files', file));

    return this.http.post<IResponseDto>(`${this.url}/${productId}/images`, formData, {
      context: new HttpContext().set(REQUIRE_AUTH, true),
    })
  }

  fetchUploadDeleteImage(productId: string, image: IProductImage): Observable<IResponseDto> {
    return this.http.delete<IResponseDto>(`${this.url}/${productId}/images`, {
      body: {
        publicId: image.publicId
      },
      context: new HttpContext().set(REQUIRE_AUTH, true),
    });
  }

  fetchUploadDeleteThumbnail(productId: string, image: IProductImage): Observable<IResponseDto> {
    return this.http.delete<IResponseDto>(`${this.url}/${productId}/thumbnail`, {
      body: {
        publicId: image.publicId
      },
      context: new HttpContext().set(REQUIRE_AUTH, true),
    });
  }
}
