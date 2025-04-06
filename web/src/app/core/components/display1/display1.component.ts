import { Component, input } from '@angular/core';

@Component({
  selector: 'app-display1',
  imports: [],
  templateUrl: './display1.component.html',
})
export class Display1Component {
  icon = input.required<string>();
  title = input.required<string>();
  content = input.required<string>();
}
