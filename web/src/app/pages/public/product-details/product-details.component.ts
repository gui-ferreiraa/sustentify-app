import { Component, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../services/product/products.service';
import { ActivatedRoute } from '@angular/router';
import { filter, firstValueFrom, map, Observable, shareReplay, switchMap, take, tap } from 'rxjs';
import { IProduct, IProductSummary } from '../../../core/types/product';
import { AsyncPipe, CommonModule, NgOptimizedImage } from '@angular/common';
import { Category } from '../../../core/enums/category.enum';
import { EnumTranslations } from '../../../translations/enum-translations';
import { Condition } from '../../../core/enums/condition.enum';
import { Material } from '../../../core/enums/material.enum';
import { DetailsWrapperComponent } from "../../../core/components/details-wrapper/details-wrapper.component";
import { BaggageClaim, BrickWall, CalendarRange, CalendarSync, ChartNoAxesColumnDecreasing, LucideAngularModule, Ruler, StickyNote } from 'lucide-angular';
import { ProductCardComponent } from "../../../core/components/product-card/product-card.component";
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { ICompany } from '../../../core/types/company';
import { AuthService } from '../../../services/auth/auth.service';
import { InterestedProductsService } from '../../../services/interested/interested-products.service';
import { ModalComponent } from "../../../core/components/modal/modal.component";
import { InterestedFormComponent } from "./components/product-form/interested-form.component";

@Component({
  selector: 'app-product-details',
  imports: [AsyncPipe, DetailsWrapperComponent, LucideAngularModule, NgOptimizedImage, ProductCardComponent, ButtonGreenComponent, ModalComponent, InterestedFormComponent],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit{
  product$!: Observable<IProduct>;
  productsRelated$!: Observable<IProductSummary[]>;
  company$!: Observable<ICompany | null>;
  productId = signal(0);
  protected productCompanyId = signal(0);
  protected showRequestButton = signal(false);
  protected companyId = signal(0);
  protected isSubmitting = false;
  protected modalIsOpen = signal(false);

  // ICONS
  protected readonly RulerIcon = Ruler;
  protected readonly BaggageClaimIcon = BaggageClaim;
  protected readonly CalendarRangeIcon = CalendarRange;
  protected readonly CalendarSyncIcon = CalendarSync;
  protected readonly ChartNoAxesColumnDecreasingIcon = ChartNoAxesColumnDecreasing;
  protected readonly BrickWallIcon = BrickWall;
  protected readonly StickyNoteIcon = StickyNote;

  constructor(
    private route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
  ) {
  }

  ngOnInit(): void {
    this.company$ = this.authService.company$;

    this.product$ = this.route.params.pipe(
      switchMap(params => {
        this.productId.set(Number(params['productId']));
        return this.productsService.fetchProductDetails(Number(params['productId']))
      }),
      tap(product => this.productCompanyId.set(product.company_id)),
      tap(product => {
        this.authService.company$.pipe(take(1)).subscribe(company => {
          if (!company) this.showRequestButton.set(true);
          else if (company.id !== product.company_id) {
            this.showRequestButton.set(true);
            this.companyId.set(company.id);
            return;
          }
          else {
            this.showRequestButton.set(false);
            this.companyId.set(company.id);
            return;
          }
        })
      }),
    )

    this.productsRelated$ = this.product$.pipe(
      take(1),
      switchMap((prod) => {
        this.productCompanyId.set(prod.company_id);

        return this.productsService.fetchProductsRelated({
          page: 0,
          size: 3,
          category: prod.category
        }).pipe(
          map(res => res.content.filter(p => p.id !== prod.id))
        );
      }),
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

  translateCategory(category: Category) {
    return EnumTranslations.Category[category];
  }

  translateCondition(condition: Condition) {
    return EnumTranslations.Condition[condition];
  }

  translateMaterial(material: Material) {
    return EnumTranslations.Material[material];
  }

  formatDate(date: string) {
    return new Date(date).toLocaleDateString('pt-BR', {
      dateStyle: 'medium'
    })
  }

  toggleModal(value?: boolean) {
    if (value){
      this.modalIsOpen.set(value);
      return;
    }

    this.modalIsOpen.set(false);
    return;
  }

  onClick() {
    this.toggleModal(true);
  }

  onSubmitInterested() {
    this.toggleModal();
  }
}
