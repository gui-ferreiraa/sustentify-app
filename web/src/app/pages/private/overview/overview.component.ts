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
import { Meta, Title } from '@angular/platform-browser';
import { TranslateEnumPipe } from '../../../pipes/translate-enum.pipe';
import { FormatPricePipe } from '../../../pipes/formats/format-price.pipe';
import { FormatDatePipe } from '../../../pipes/formats/format-date.pipe';

@Component({
  selector: 'app-overview',
  imports: [
    AsyncPipe,
    TranslateEnumPipe,
    FormatPricePipe,
    FormatDatePipe,
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
    private readonly titleService: Title,
    private readonly metaService: Meta,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Visão Geral | Sustentify');
    this.metaService.updateTag({ name: 'description', content: 'Acompanhe o desempenho da sua empresa na Sustentify com uma visão completa de métricas e atividades.' });

    const productId$ = this.route.params.pipe(
      switchMap(params => this.productsService.fetchProductDetails(params['productId']))
    );

    this.product$ = productId$;

    this.solicitations$ = productId$.pipe(
      switchMap(product => this.interestedService.fetchInterestedByProductId(product.id))
    );
  }

  navigateToSolicitation(productId: string): void {
    this.router.navigate([`/products/${productId}`]);
  }

  refreshLists() {
    this.solicitations$ = this.product$.pipe(
      switchMap(product => this.interestedService.fetchInterestedByProductId(product.id))
    );
  }

  deleteInterestedProduct(productId: string) {
    this.interestedService.fetchInterestedDelete(productId).subscribe({
      next: (value) => {
        if (value.successfully) {
          this.toastService.success('Solicitação Deletada!');
          this.refreshLists();
        }
      },
      error: (err) => {
        this.toastService.error('Erro ao deletar!');
      }
    })
  }

  updateInterestedProduct(id: string, status: InterestStatus) {
    this.interestedService.fetchInterestedUpdate(id, status).subscribe({
      next: (value) => {
        if (value.successfully) {
          this.toastService.success('Solicitação Atualizada!');
          this.refreshLists();
        }
      },
      error: (err) => {
        this.toastService.error('Erro ao atualizar!');
      }
    });
  }

  openModal(id: string) {
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
}
