import { Component, input, InputSignal } from '@angular/core';
import { TextColor } from '../../types/enums';

@Component({
  selector: 'app-subtitle',
  imports: [],
  template: `
    <p [class]="'text-[10px] md:text-base font-semibold text-[#A2F2C9] uppercase tracking-widest' + (this.color() ? ' ' + this.color() : '')">
      {{ title() }}
    </p>
    `
})
export class SubtitleComponent {
  title: InputSignal<string> = input.required<string>();
  color: InputSignal<TextColor> = input.required<TextColor>();

  constructor() {}
}
