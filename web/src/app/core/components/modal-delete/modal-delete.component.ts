import { Component, ElementRef, EventEmitter, HostListener, input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-delete',
  imports: [],
  templateUrl: './modal-delete.component.html'
})
export class ModalDeleteComponent {
  isOpen = input(false);
  title = input.required<string>();
  message = input.required<string>();
  @Output() clickedOutside = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  constructor(
    private readonly elementRef: ElementRef,
  ) {}

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
