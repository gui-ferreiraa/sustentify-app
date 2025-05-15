import { Component, EventEmitter, input, Output } from '@angular/core';

@Component({
  selector: 'app-table',
  imports: [],
  templateUrl: './table.component.html',
})
export class TableComponent {
  title = input.required<string>();
  subtitle = input.required<string>();
  theads = input.required<string[]>();
  buttonTitle = input<string>();
  @Output() buttonClicked = new EventEmitter<void>();

  onClickButton() {
    this.buttonClicked.emit();
  }

}
