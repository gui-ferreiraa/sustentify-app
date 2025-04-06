import { Component, input } from '@angular/core';
import { IProductSummary } from '../../types/product';
import { NgOptimizedImage } from '@angular/common';
import { LucideAngularModule, MousePointerClick, SquareStack } from 'lucide-angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-card',
  imports: [NgOptimizedImage, LucideAngularModule],
  templateUrl: './product-card.component.html',
})
export class ProductCardComponent {
  productSummary = input.required<IProductSummary>();
  MousePointerClick = MousePointerClick;
  SquareStack = SquareStack;

  constructor(private router: Router) {}

  onClick() {
    this.router.navigate(['/products/', this.productSummary().id])
  }
}
