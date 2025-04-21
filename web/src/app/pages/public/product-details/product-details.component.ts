import { Component, OnInit, signal } from '@angular/core';
import { ProductsService } from '../../../services/product/products.service';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, switchMap, take, tap } from 'rxjs';
import { IProduct, IProductSummary } from '../../../core/types/product';
import { AsyncPipe, CommonModule, NgOptimizedImage } from '@angular/common';
import { DetailsWrapperComponent } from "../../../core/components/details-wrapper/details-wrapper.component";
import { BaggageClaim, BrickWall, CalendarRange, CalendarSync, ChartNoAxesColumnDecreasing, LucideAngularModule, Ruler, StickyNote } from 'lucide-angular';
import { ProductCardComponent } from "../../../core/components/product-card/product-card.component";
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { ICompany } from '../../../core/types/company';
import { AuthService } from '../../../services/auth/auth.service';
import { ModalComponent } from "../../../core/components/modal/modal.component";
import { InterestedFormComponent } from "./components/product-form/interested-form.component";
import { Meta, Title } from '@angular/platform-browser';
import { FormatDatePipe } from '../../../pipes/formats/format-date.pipe';
import { FormatPricePipe } from '../../../pipes/formats/format-price.pipe';
import { TranslateEnumPipe } from '../../../pipes/translate-enum.pipe';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-details',
  imports: [
    AsyncPipe,
    FormatDatePipe,
    FormatPricePipe,
    TranslateEnumPipe,
    DetailsWrapperComponent,
    LucideAngularModule,
    NgOptimizedImage,
    ProductCardComponent,
    ButtonGreenComponent,
    ModalComponent,
    InterestedFormComponent
  ],
  templateUrl: './product-details.component.html',
})
export class ProductDetailsComponent implements OnInit{
  product$!: Observable<IProduct>;
  productsRelated$!: Observable<IProductSummary[]>;
  company$!: Observable<ICompany | null>;
  productId = signal('');
  protected productCompanyId = signal('');
  protected showRequestButton = signal(false);
  protected companyId = signal('');
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
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly toastService: ToastrService,
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
    private readonly titleService: Title,
    private readonly metaService: Meta,
  ) {
  }

  ngOnInit(): void {
    this.metaService.updateTag({ name: 'description', content: 'Veja informações detalhadas sobre este produto sustentável, suas características e impacto ambiental.' });

    this.company$ = this.authService.company$;

    this.product$ = this.route.params.pipe(
      switchMap(params => {
        this.productId.set(params['productId']);
        return this.productsService.fetchProductDetails(params['productId'])
      }),
      tap(product => this.productCompanyId.set(product.company_id)),
      tap(product => {
        this.authService.company$.pipe(take(1)).subscribe(company => {
          this.titleService.setTitle(`Produto - ${product.name} | Sustentify`);
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

  toggleModal(value?: boolean) {
    if (value){
      this.modalIsOpen.set(value);
      return;
    }

    this.modalIsOpen.set(false);
    return;
  }

  onClick() {
    this.company$.subscribe(vl => {
      if (vl) {
        this.toggleModal(true);
        return;
      }

      this.router.navigate(['/signin']);
      this.toastService.warning('Faça o login para continuar!')
    });
  }

  onSubmitInterested() {
    this.toggleModal();
  }
}
