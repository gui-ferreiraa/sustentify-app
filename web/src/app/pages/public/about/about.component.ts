import { Component } from '@angular/core';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { TextColor } from '../../../core/types/enums';
import { NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-about',
  imports: [NgOptimizedImage, TitleDisplayComponent],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  about = {
    title: 'Transformando Descartes em Oportunidades Sustentáveis',
    titleColor: TextColor.black,
    subtitle: 'sobre',
    subtitleColor: TextColor.gray,
  }
}
