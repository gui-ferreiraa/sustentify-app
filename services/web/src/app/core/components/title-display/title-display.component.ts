import { AfterViewInit, booleanAttribute, Component, ElementRef, input, InputSignal, OnInit, ViewChild } from '@angular/core';
import { SubtitleComponent } from '../subtitle/subtitle.component';
import { TextColor } from '../../types/enums';
import { classMerge } from '../../utils/classMerge';

@Component({
  selector: 'app-title-display',
  imports: [SubtitleComponent],
  template: `
    <div [class]="classes">
      <app-subtitle
        [color]="subtitleColor()"
        [title]="subtitle()"
      />
      <h2
        [class]="'capitalize text-xl md:text-2xl lg:text-3xl font-semibold ' + titleColor()"
      >
        {{ title() }}
      </h2>
    </div>
  `
})
export class TitleDisplayComponent {
  title = input.required<string>();
  titleColor = input.required<TextColor>();

  subtitle = input.required<string>();
  subtitleColor = input.required<TextColor>();
  center = input.required({transform: booleanAttribute});

  get classes() {
    return classMerge(
      'w-full flex flex-col gap-2 mb-4',
      {
        'text-center': this.center() === true,
      }
    )
  }
}
