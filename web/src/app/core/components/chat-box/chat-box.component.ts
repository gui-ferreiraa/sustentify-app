import { NgClass } from '@angular/common';
import { AfterViewInit, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { IAChatService } from '../../../services/iachat/iachat.service';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";

@Component({
  selector: 'app-chat-box',
  imports: [
    NgClass,
    LoadingSpinnerComponent
],
  templateUrl: './chat-box.component.html',
})
export class ChatBoxComponent {
  protected isOpen = signal(false);
  protected userInput = signal('');
  protected userMessage = signal('');
  protected isSubmitting = signal(false);
  protected assistantResponse = signal<string | null>(null);
  @ViewChild('chatContainer') chatContainerRef!: ElementRef<HTMLDivElement>

  constructor(
    private readonly chat: IAChatService
  ) {}

  toggleChatbox() {
    this.isOpen.set(!this.isOpen());
  }

  onSubmit() {
    if (!this.userInput().trim()) return;

    this.isSubmitting.set(true)
    this.userMessage.set(this.userInput());
    this.userInput.set('');

    this.chat.sendMessage(this.userMessage()).subscribe({
      next: (value) => {
        this.assistantResponse.set(value.content)
      },
      error: (err) => {
        this.isSubmitting.set(false);
      },
      complete: () => {
        this.isSubmitting.set(false);
      },
    })
  }
}
