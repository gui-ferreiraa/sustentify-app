import { Component, input } from '@angular/core';

@Component({
  selector: 'app-overview-card',
  imports: [],
  templateUrl: './overview-card.component.html',
})
export class OverviewCardComponent {
  title = input.required<string>();
  content = input.required<string>();
}
