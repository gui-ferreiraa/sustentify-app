import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sustentify-logo',
  imports: [NgOptimizedImage],
  template: `
    <div
      class="flex items-center gap-1 cursor-pointer"
      (click)="onClick()"
    >
      <img
        ngSrc="/sustentify/public/logo_zfouyw.png"
        alt="Sustentify Logo"
        width="112"
        height="98"
        class="max-w-14 max-h-14 object-contain"
        priority
      />
      <h1 class="flex items-center gap-1 text-white font-semibold text-xl">Sustentify</h1>
    </div>
  `
})
export class SustentifyLogoComponent {

  constructor(private router: Router) {}

  onClick() {
    this.router.navigate(['/'])
  }
}
