import { Component, OnInit } from '@angular/core';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { TextColor } from '../../../core/types/enums';
import { ProductsService } from '../../../services/product/products.service';
import { Observable } from 'rxjs';
import { IProductSummary } from '../../../core/types/product';
import { ProductCardComponent } from "../../../core/components/product-card/product-card.component";
import { CommonModule } from '@angular/common';
import { FilterBarComponent } from '../../../core/components/filter-bar/filter-bar.component';
import { ActivatedRoute } from '@angular/router';
import { PaginationComponent } from "../../../core/components/pagination/pagination.component";
import { Meta, Title } from '@angular/platform-browser';

@Component({
  selector: 'app-products',
  imports: [CommonModule, TitleDisplayComponent, ProductCardComponent, FilterBarComponent, PaginationComponent],
  templateUrl: './products.component.html',
  providers: [ProductsService]
})
export class ProductsComponent implements OnInit {
  productsTexts = {
    title: 'Produtos Descartados',
    titleColor: TextColor.black,
    subtitle: 'Transforme o desperdício em oportunidade',
    subtitleColor: TextColor.gray
  }

  products$!: Observable<IProductSummary[]>

  constructor(
    private route: ActivatedRoute,
    private readonly productsService: ProductsService,
    private readonly titleService: Title,
    private readonly metaService: Meta,

  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Produtos Descartados - Sustentify');
    this.metaService.updateTag({ name: 'description', content: 'Explore nossa lista de produtos sustentáveis disponíveis para aquisição e descarte consciente.' });

    this.route.queryParams.subscribe(params => {
      const filters = {
        category: params['category'] || null,
        condition: params['condition'] || null,
        material: params['material'] || null,
        page: params['page'] || 0,
        size: params['size'] || 5,
      }

      this.productsService.fetchProducts(
        filters.size,
        filters.page,
        filters.category,
        filters.condition,
        filters.material
      ).subscribe();
      this.products$ = this.productsService.products$;
    })
  }
}
