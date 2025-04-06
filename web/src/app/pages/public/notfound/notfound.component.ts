import { Component } from '@angular/core';
import { ParagraphSupportComponent } from "../../../core/components/paragraph-support/paragraph-support.component";
import { TextColor } from '../../../core/types/enums';
import { ButtonPrimaryComponent } from "../../../core/components/button-primary/button-primary.component";

@Component({
  selector: 'app-notfound',
  imports: [ParagraphSupportComponent, ButtonPrimaryComponent],
  templateUrl: './notfound.component.html',
})
export class NotfoundComponent {
  public paragraphSupportColor = TextColor.black
}
