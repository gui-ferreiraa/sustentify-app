import { Component, input } from '@angular/core';
import { TextColor } from '../../types/enums';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-display1',
  imports: [LucideAngularModule],
  templateUrl: './display1.component.html',
})
export class Display1Component {
  public icon = input.required<any>();
  public title = input.required<string>();
  public description = input.required<string>();
  public titleColor = input.required<TextColor>();
  public descriptionColor = input.required<TextColor>();
  public flexDirection = input.required<'flex-col' | 'flex-row'>();

  contructor() {}

}
