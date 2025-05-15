import { Component } from '@angular/core';
import { ParagraphSupportComponent } from '../paragraph-support/paragraph-support.component';
import { TextColor } from '../../types/enums';
import { SustentifyLogoComponent } from "../sustentify-logo/sustentify-logo.component";
import { Category } from '../../enums/category.enum';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [ParagraphSupportComponent, SustentifyLogoComponent, RouterModule],
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  public titleLinkColor = TextColor.yellow;
  public subtitleColor = TextColor.white;
  public metalSlug = Category.METAL;
  public plasticSlug = Category.PLASTIC;
}
