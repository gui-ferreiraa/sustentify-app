import { Component } from '@angular/core';

@Component({
  selector: 'app-sustentify-logo',
  imports: [],
  template: `
    <div class="flex items-center gap-1">
      <img
        src="/assets/images/logo.png"
        alt="Sustentify Logo"
        class="max-w-14 max-h-14 object-cover"
      />
      <h1 class="flex items-center gap-1 text-white font-semibold text-xl">Sustentify</h1>
    </div>
  `
})
export class SustentifyLogoComponent {

}
