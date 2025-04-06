import { Component } from '@angular/core';
import { ParagraphSupportComponent } from "../../../core/components/paragraph-support/paragraph-support.component";
import { TextColor } from '../../../core/types/enums';
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-notfound',
  imports: [ParagraphSupportComponent, ButtonGreenComponent],
  templateUrl: './notfound.component.html',
})
export class NotfoundComponent {
  public paragraphSupportColor = TextColor.black

  constructor(private router: Router) {}

  onClick() {
    this.router.navigate(['/'])
  }
}
