import { Component, ElementRef, EventEmitter, HostListener, input, Output, output } from '@angular/core';
import { RouterModule } from '@angular/router';

interface OptionDropdown {
  label: string;
  onClick: () => void;
}

@Component({
  selector: 'app-menu-dropdown',
  imports: [RouterModule],
  templateUrl: './menu-dropdown.component.html',
})
export class MenuDropdownComponent {
  isOpen = input.required<boolean>();
  options = input.required<OptionDropdown[]>();
  toggle = output();
  @Output() clickedOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  toggleDropdown() {
    this.toggle.emit();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside && this.isOpen()) {
      this.clickedOutside.emit();
    }
  }
}
