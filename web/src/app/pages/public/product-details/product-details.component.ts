import { Component, OnInit } from '@angular/core';
import { ProductsService } from '../../../services/product/products.service';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { IProduct } from '../../../core/types/product';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit{
  product$!: Observable<IProduct>;

  constructor(
    private route: ActivatedRoute,
    private readonly productsService: ProductsService,
  ) {
  }

  ngOnInit(): void {
    this.product$ = this.route.params.pipe(
      switchMap(params => {
        return this.productsService.fetchProductDetails(Number(params['productId']))
      })
    )
  }

  formatPrice(price: number) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currencyDisplay: 'code',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 3
    }).format(price)
  }

}
