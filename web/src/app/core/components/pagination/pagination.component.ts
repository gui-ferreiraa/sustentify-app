import { Component } from '@angular/core';
import { ProductsService } from '../../../services/product/products.service';
import { Observable } from 'rxjs';
import { IProductPagination } from '../../types/product';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
})
export class PaginationComponent {
  pagination$!: Observable<IProductPagination>;
  currentPage: number = 0;
  totalPages: number = 0;

  constructor(
    private productsService: ProductsService,
    private router: Router,
  ) {
    this.pagination$ = this.productsService.productsPagination$;
    this.pagination$.subscribe(page => {
      this.currentPage = page.number;
      this.totalPages = page.totalPages;
    });
  }

  goToPage(page: number) {
    if (page < 0 || page >= this.totalPages) {
      return;
    }

    this.router.navigate([], {
      queryParams: { page },
      queryParamsHandling: 'merge'
    })
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.goToPage(this.currentPage + 1);
    }
  }

  get pages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }

}
