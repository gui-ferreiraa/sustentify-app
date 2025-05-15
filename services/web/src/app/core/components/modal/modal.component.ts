import { Component, ElementRef, EventEmitter, HostListener, input, Output, signal } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';

@Component({
  selector: 'app-modal',
  imports: [LucideAngularModule],
  templateUrl: './modal.component.html',
})
export class ModalComponent {
  isOpen = input(false);
  @Output() clickedOutside = new EventEmitter<void>();
  protected readonly closeIcon = X;

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
