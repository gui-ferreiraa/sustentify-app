import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-button-green',
  imports: [],
  template: `
    <button
      class="bg-[#21926B] px-3 md:px-6 py-3 text-white rounded-lg font-semibold text-[12px] md:text-base hover:bg-[#1A7B5D] transition duration-200 ease-in-out cursor-pointer disabled:opacity-40"
      (click)="onClick()"
      [type]="type()"
      [disabled]="disabled()"
    >
      @if (disabled()) {
        Carregando...
      }
      @else {

        {{  title() }}
      }
    </button>`
})
export class ButtonGreenComponent {
  title = input.required<string>();
  type = input.required<'button' | 'submit' | 'reset'>();
  disabled = input.required<boolean>();
  @Output() click = new EventEmitter<HTMLButtonElement>();

  constructor() {}

  onClick() {
    this.click.emit()
  }
}
