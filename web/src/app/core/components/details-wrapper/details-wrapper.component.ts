import { Component, input } from '@angular/core';

@Component({
  selector: 'app-details-wrapper',
  imports: [],
  templateUrl: './details-wrapper.component.html',
})
export class DetailsWrapperComponent {
  title = input.required<string>();
  content = input.required<string>();
}
