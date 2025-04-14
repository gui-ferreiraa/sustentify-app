import { Component, ElementRef, EventEmitter, HostListener, input, Output, signal } from '@angular/core';

@Component({
  selector: 'app-modal',
  imports: [],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  isOpen = input(false);
  @Output() clickedOutside = new EventEmitter<void>();

  constructor(private elementRef: ElementRef) {}

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (clickedInside && this.isOpen()) {
      this.onClose();
    }
  }

  onClose() {
    this.clickedOutside.emit();
  }
}
