import { Component, input, InputSignal } from '@angular/core';
import { TextColor } from '../../types/enums';

@Component({
  selector: 'app-paragraph-support',
  imports: [],
  template: `
    <p [class]="'text-[10px] sm:text-sm lg:text-[18px] font-semibold tracking-wide' + (this.color() ? ' ' + this.color() : '')">
      {{ content() }}
    </p>
`

})
export class ParagraphSupportComponent {
  content: InputSignal<string> = input.required<string>();
  color: InputSignal<TextColor> = input.required<TextColor>();

  constructor() { }

}
