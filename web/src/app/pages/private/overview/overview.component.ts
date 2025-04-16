import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';
import { ProductsService } from '../../../services/product/products.service';
import { IProduct } from '../../../core/types/product';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { TextColor } from '../../../core/types/enums';
import { OverviewCardComponent } from "./components/overview-card/overview-card.component";
import { TableComponent } from "../../../core/components/table/table.component";
import { AsyncPipe } from '@angular/common';
import { EnumTranslations } from '../../../translations/enum-translations';
import { Category } from '../../../core/enums/category.enum';
import { InterestedProductsService } from '../../../services/interested/interested-products.service';
import { IInterestedProduct, IInterestedProductSummary } from '../../../core/types/interested-products';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from "../../../core/components/modal/modal.component";
import { InterestStatus } from '../../../core/enums/InterestStatus';
import { Department } from '../../../core/enums/department.enum';

@Component({
  selector: 'app-overview',
  imports: [
    AsyncPipe,
    TitleDisplayComponent,
    OverviewCardComponent,
    TableComponent,
    ModalComponent
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
  solicitations$!: Observable<IInterestedProductSummary[]>;
  protected modalIsOpen = signal(false);
  protected modalInterested = signal<IInterestedProduct | null>(null);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly productsService: ProductsService,
    private readonly interestedService: InterestedProductsService,
    private readonly toastService: ToastrService,
  ) {}

  ngOnInit(): void {
    const productId$ = this.route.params.pipe(
      switchMap(params => this.productsService.fetchProductDetails(Number(params['productId'])))
    );

    this.product$ = productId$;

    this.solicitations$ = productId$.pipe(
      switchMap(product => this.interestedService.fetchInterestedByProductId(product.id))
    );
  }

  translateCategory(category: Category): string {
    return EnumTranslations.Category[category]
  }

  navigateToSolicitation(productId: number): void {
    this.router.navigate([`/products/${productId}`]);
  }

  deleteInterestedProduct(productId: number) {
    this.interestedService.fetchInterestedDelete(productId).subscribe({
      next: (value) => {
        if (value.successfully) {
          this.toastService.success('Solicitação Deletada!');
        }
      },
      error: (err) => {
        this.toastService.error('Erro ao deletar!');
      }
    })
  }

  openModal(id: number) {
    this.interestedService.fetchInterestedDetails(id).subscribe((solicitation) => {
      if (solicitation) {
        console.log(solicitation)
        this.modalInterested.set(solicitation);
        this.modalIsOpen.set(true);
      }
    })
  }

  closeModal() {
    this.modalInterested.set(null);
    this.modalIsOpen.set(false);
  }

  formatPrice(price?: number): string {
    if (!price) return '';

    return price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  translateStatus(status: InterestStatus) {
    return EnumTranslations.Status[status];
  }

  translateDepartment(department?: Department) {
    if (!department) return 'Outro';

    return EnumTranslations.Department[department];
  }

  formatDate(date?: string): string {
    return date ? new Date(date).toLocaleDateString('pt-BR', {
      dateStyle: 'medium'
    }) : '';
  }
}
