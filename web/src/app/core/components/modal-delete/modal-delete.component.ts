import { Component, ElementRef, EventEmitter, HostListener, input, Output } from '@angular/core';
import { LucideAngularModule, X } from 'lucide-angular';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-modal-delete',
  imports: [
    LucideAngularModule,
    LoadingSpinnerComponent,
    NgClass
],
  templateUrl: './modal-delete.component.html'
})
export class ModalDeleteComponent {
  isOpen = input(false);
  title = input.required<string>();
  confirmTitle = input<string>('Deletar');
  cancelTitle = input<string>('Cancelar');
  message = input.required<string>();
  isLoading = input<boolean>(false);
  @Output() clickedOutside = new EventEmitter<void>();
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  protected readonly closeIcon = X;

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
