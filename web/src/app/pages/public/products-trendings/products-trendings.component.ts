import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TitleDisplayComponent } from '../../../core/components/title-display/title-display.component';
import { ProductCardComponent } from '../../../core/components/product-card/product-card.component';
import { PaginationComponent } from '../../../core/components/pagination/pagination.component';
import { IProductSummary } from '../../../core/types/product';
import { Observable } from 'rxjs';
import { ProductsService } from '../../../services/product/products.service';
import { TextColor } from '../../../core/types/enums';

@Component({
  selector: 'app-products-trendings',
  imports: [CommonModule, TitleDisplayComponent, ProductCardComponent, PaginationComponent],
  templateUrl: './products-trendings.component.html',
})
export class ProductsTrendingsComponent implements OnInit {
  productsTexts = {
    title: 'Produtos Descartados',
    titleColor: TextColor.black,
    subtitle: 'em alta',
    subtitleColor: TextColor.gray
  }

  products$!: Observable<IProductSummary[]>

  constructor(
    private readonly productsService: ProductsService
  ) {
  }

  ngOnInit(): void {
    // this.productsService.fetchProductsTrending(10, 0).subscribe();
    // this.products$ = this.productsService.products$;
  }
}
