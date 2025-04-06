import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { SubtitleComponent } from '../../../core/components/subtitle/subtitle.component';
import { TextColor } from '../../../core/types/enums';
import { ParagraphSupportComponent } from '../../../core/components/paragraph-support/paragraph-support.component';
import { ButtonPrimaryComponent } from "../../../core/components/button-primary/button-primary.component";
import { Display1Component } from "../../../core/components/display1/display1.component";

@Component({
  selector: 'app-home',
  imports: [NgOptimizedImage, SubtitleComponent, ParagraphSupportComponent, ButtonPrimaryComponent, Display1Component],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  public readonly mainImage = '/assets/images/main-sustainable.jpg';
  public readonly subtitleColor = TextColor.lightGreen;
  public readonly paragraphSupportColor = TextColor.white;
  public readonly subtitleValueColor = TextColor.dark;
}
