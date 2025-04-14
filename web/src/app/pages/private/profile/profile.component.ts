import { Component, OnInit, signal } from '@angular/core';
import { AuthService } from '../../../services/auth/auth.service';
import { map, Observable } from 'rxjs';
import { ICompany } from '../../../core/types/company';
import { AsyncPipe } from '@angular/common';
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { Router } from '@angular/router';
import { TableComponent } from "../../../core/components/table/table.component";
import { IProduct, IProductSummary } from '../../../core/types/product';
import { ProductsService } from '../../../services/product/products.service';
import { MenuDropdownComponent } from "../../../core/components/menu-dropdown/menu-dropdown.component";
import { ModalComponent } from "../../../core/components/modal/modal.component";
import { ProductUpdateFormComponent } from "./components/product-update-form/product-update-form.component";
import { ProductFormComponent } from "./components/product-form/product-form.component";
import { ToastrService } from 'ngx-toastr';

interface IModal {
  label: 'profile' | 'product';
  type: 'edit' | 'new';
  id: number;
}

@Component({
  selector: 'app-profile',
  imports: [
    AsyncPipe,
    ButtonGreenComponent,
    TableComponent,
    MenuDropdownComponent,
    ModalComponent,
    ProductUpdateFormComponent,
    ProductFormComponent
],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  protected company$!: Observable<ICompany | null>;
  protected products$!: Observable<IProductSummary[]>;
  protected dropdownIsOpen = signal(-1);
  protected modalIsOpen = signal(false);
  protected modalContent = signal<'edit-profile' | 'edit-product' | 'new-product' | null>(null);
  protected productUpdated = signal<IProduct | null>(null);

  constructor(
    private readonly authService: AuthService,
    private readonly productsService: ProductsService,
    private readonly router: Router,
    private readonly toastService: ToastrService
  ) {}

  ngOnInit(): void {
    this.company$ = this.authService.company$;

    this.products$ = this.productsService.fetchProductsByCompany().pipe(
      map(res => res.content)
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/signin'])
  }

  getDropdownOptions(productId: number) {
    return [
      {
        label: 'Overview',
        onClick: () => this.openOverview(productId),
      },
      {
        label: 'Editar',
        onClick: () => this.openEditProductModal(productId),
      },
      {
        label: 'Deletar',
        onClick: () => this.deleteProductModal(productId),
      }
    ]
  }

  toggleDropdown(productId: number) {
    this.dropdownIsOpen.set(productId);
  }

  closeModal() {
    this.modalContent.set(null)
    this.modalIsOpen.set(false);
  }

  updateProductsList() {
    this.products$ = this.productsService.fetchProductsByCompany().pipe(
      map(res => res.content)
    );
  }

  openEditProductModal(id: number) {
    this.productsService.fetchProductDetails(id).subscribe({
      next: (res) => {
        this.productUpdated.set(res);
        console.log(res);
        this.modalContent.set('edit-product');
        this.modalIsOpen.set(true);
      }
    })
  }

  openEditCompanyModal() {
    this.modalContent.set('edit-profile');
    this.modalIsOpen.set(true);
  }

  openNewProductModal() {
    this.modalContent.set('new-product');
    this.modalIsOpen.set(true);
  }

  submitNewProductModal(product: IProduct) {
    this.closeModal();

    this.updateProductsList();
  }

  deleteProductModal(productId: number) {
    this.productsService.fetchProductDelete(productId).subscribe({
      next: (value) => {
        if (value.successfully) {
          this.toastService.success('Produto Deletado!');
          this.updateProductsList();
          this.closeModal();
        }
      },
      error: (err) => {
        this.toastService.error('Erro ao deletar!');
      },
      complete: () => this.closeModal(),
    })
  }

  submitProductUpdateModal() {
    this.closeModal();

    this.updateProductsList();
  }

  openOverview(productId: number) {
    this.router.navigate([`/profile/overview/${productId}`]);
  }
}
