import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ProductsService } from '../../../services/product/products.service';
import { IProduct } from '../../../core/types/product';

@Component({
  selector: 'app-overview',
  imports: [

  ],
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  product$!: Observable<IProduct>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly productsService: ProductsService
  ) {}

  ngOnInit(): void {
    this.product$ = this.route.params.pipe(
      switchMap(param => this.productsService.fetchProductDetails(Number(param['productId'])))
    );

    this.product$.subscribe(vl => console.log(vl));
  }
}
