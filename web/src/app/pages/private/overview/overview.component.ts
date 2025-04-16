import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { ProductsService } from '../../../services/product/products.service';
import { IProduct } from '../../../core/types/product';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { TextColor } from '../../../core/types/enums';
import { OverviewCardComponent } from "./components/overview-card/overview-card.component";
import { TableComponent } from "../../../core/components/table/table.component";
import { AsyncPipe } from '@angular/common';
import { EnumTranslations } from '../../../translations/enum-translations';
import { Category } from '../../../core/enums/category.enum';

@Component({
  selector: 'app-overview',
  imports: [
    AsyncPipe,
    TitleDisplayComponent,
    OverviewCardComponent,
    TableComponent
],
  templateUrl: './overview.component.html',
})
export class OverviewComponent implements OnInit {
  protected readonly overview = {
    title: 'Overview',
    subtitle: 'Produto Overview',
    titleColor: TextColor.black,
    subtitleColor: TextColor.gray,
  }
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

  translateCategory(category: Category): string {
    return EnumTranslations.Category[category]
  }
}
