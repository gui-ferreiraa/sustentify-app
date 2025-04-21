import { NgClass } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner',
  imports: [NgClass],
  template: `
    <div
      class="inline-block w-4 h-4 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-surface motion-reduce:animate-[spin_1.5s_linear_infinite]"
      [ngClass]="{
        'text-white': color() === 'white',
        'text-gray-500': color() === 'gray',
      }"
      role="status">
      <span
        class="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
        >Loading...</span
      >
    </div>
  `
})
export class LoadingSpinnerComponent {
  color = input<'white' | 'gray'>('white')
}
