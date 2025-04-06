import { Component, Input, input, InputSignal } from '@angular/core';

@Component({
  selector: 'app-button-green',
  imports: [],
  template: `
    <button
      class="bg-[#21926B] px-3 md:px-6 py-3 text-white rounded-lg font-semibold text-[12px] md:text-base hover:bg-[#1A7B5D] transition duration-200 ease-in-out cursor-pointer"
    >
      {{  title() }}
    </button>`
})
export class ButtonGreenComponent {
  title = input.required<string>();

  constructor() {}
}
