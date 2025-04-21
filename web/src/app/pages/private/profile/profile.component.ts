import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { map, Observable } from 'rxjs';
import { ICompany } from '../../../core/types/company';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { TableComponent } from "../../../core/components/table/table.component";
import { IProduct, IProductSummary } from '../../../core/types/product';
import { ProductsService } from '../../../services/product/products.service';
import { ProductUpdateFormComponent } from "./components/product-update-form/product-update-form.component";
import { ProductFormComponent } from "./components/product-form/product-form.component";
import { ToastrService } from 'ngx-toastr';
import { EnumTranslations } from '../../../translations/enum-translations';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { TextColor } from '../../../core/types/enums';
import { IInterestedProductSummary } from '../../../core/types/interested-products';
import { InterestedProductsService } from '../../../services/interested/interested-products.service';
import { InterestStatus } from '../../../core/enums/InterestStatus';
import { Meta, Title } from '@angular/platform-browser';
import { ProfileUpdateFormComponent } from "./components/profile-update-form/profile-update-form.component";
import { ModalDeleteComponent } from "../../../core/components/modal-delete/modal-delete.component";
import { TranslateEnumPipe } from '../../../pipes/translate-enum.pipe';
import { FormatPricePipe } from '../../../pipes/formats/format-price.pipe';
import { FormatDatePipe } from '../../../pipes/formats/format-date.pipe';
import { ModalManagerService } from '../../../services/modal-manager/modal-manager.service';

@Component({
  selector: 'app-profile',
  imports: [
    AsyncPipe,
    TranslateEnumPipe,
    FormatPricePipe,
    FormatDatePipe,
    TableComponent,
    ProductUpdateFormComponent,
    ProductFormComponent,
    TitleDisplayComponent,
    ProfileUpdateFormComponent,
    ModalDeleteComponent
],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  protected readonly profileTexts = {
    title: 'Dashboard',
    subtitle: 'Gerencie sua empresa e produtos',
    subtitleColor: TextColor.gray,
    titleColor: TextColor.black,
  }

  protected company$!: Observable<ICompany | null>;
  protected products$!: Observable<IProductSummary[]>;
  protected interestedProducts$!: Observable<IInterestedProductSummary[]>;

  protected idSelected = signal('');
  protected productUpdated = signal<IProduct | null>(null);
  protected isSubmitting = signal(false);

  constructor(
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
    protected readonly modalManager: ModalManagerService,
    private readonly interestedService: InterestedProductsService,
    private readonly router: Router,
    private readonly toastService: ToastrService,
    private readonly titleService: Title,
    private readonly metaService: Meta,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Painel | Sustentify');
    this.metaService.updateTag({ name: 'description', content: 'Acesse dados, estatísticas e ferramentas para gerenciar os produtos e interações da sua empresa na plataforma Sustentify.' });

    this.company$ = this.authService.company$;

    this.products$ = this.productsService.fetchProductsByCompany().pipe(
      map(res => res.content)
    );

    this.interestedProducts$ = this.interestedService.fetchInterestedByCompany();
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin'])
  }

  updateProductsList() {
    this.products$ = this.productsService.fetchProductsByCompany().pipe(
      map(res => res.content)
    );

    this.interestedProducts$ = this.interestedService.fetchInterestedByCompany();
  }

  searchProduct(id: string) {
    this.productUpdated.set(null);
    this.productsService.fetchProductDetails(id).subscribe({
      next: (res) => {
        this.productUpdated.set(res);
      }
    })
  }

  deleteProduct(productId: string) {
    this.isSubmitting.set(true);
    this.productsService.fetchProductDelete(productId).subscribe({
      next: (value) => {
        if (value.successfully) {
          this.toastService.success('Produto Deletado!');
          this.updateProductsList();
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.toastService.error('Erro ao deletar!');
        this.isSubmitting.set(false);
      },
    })
  }

  openOverview(productId: string) {
    this.router.navigate([`/dashboard/overview/${productId}`]);
  }

  deleteInterestedProduct(id: string) {
    this.isSubmitting.set(true);
    this.interestedService.fetchInterestedDelete(id).subscribe({
      next: (value) => {
        if (value.successfully) {
          this.toastService.success('Solicitação Deletada!');
          this.updateProductsList();
        }
        this.isSubmitting.set(false);
      },
      error: (err) => {
        this.toastService.error('Erro ao deletar!');
        this.isSubmitting.set(false);
      },
    })
  }

  recoverPassword() {
    this.authService.logout();
    this.router.navigate(['/recover-password'])
  }
}
