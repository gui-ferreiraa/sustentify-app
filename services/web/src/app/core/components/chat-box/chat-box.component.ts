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
  protected streamMode = signal(true);

  @ViewChild('chatContainer') chatContainerRef!: ElementRef<HTMLDivElement>
  @ViewChild('output') assistantOutput!: ElementRef<HTMLParagraphElement>

  constructor(
    private readonly chat: IAChatService
  ) {  }

  toggleChatbox() {
    this.isOpen.set(!this.isOpen());
  }

  async onSubmit() {
    if (!this.userInput().trim()) return;

    this.isSubmitting.set(true)
    this.userMessage.set(this.userInput());
    this.userInput.set('');

    if (this.streamMode()) {
      this.assistantOutput.nativeElement.textContent = '';
      await this.chat.sendQuestionStream(this.userMessage(), (chunk) => {
        this.assistantOutput.nativeElement.textContent += chunk;
      })
      this.isSubmitting.set(false);
      return;
    }

    this.chat.sendQuestion(this.userMessage()).subscribe({
      next: (value) => {
        this.assistantOutput.nativeElement.textContent = value.content;
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
