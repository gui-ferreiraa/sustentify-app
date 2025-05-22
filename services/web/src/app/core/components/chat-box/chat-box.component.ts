import { NgClass } from '@angular/common';
import { Component, ElementRef, signal, ViewChild } from '@angular/core';
import { IAChatService } from '../../../services/iachat/iachat.service';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat-box',
  imports: [
    NgClass,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
],
  templateUrl: './chat-box.component.html',
})
export class ChatBoxComponent {
  protected isOpen = signal(false);
  protected userInput = signal('');
  protected userMessage = signal('');
  protected isSubmitting = signal(false);

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
    this.assistantOutput.nativeElement.textContent = '';
    this.userInput.set('');

    try {
      await this.chat.sendQuestionStream(this.userMessage(), (chunk) => {
        this.assistantOutput.nativeElement.textContent += chunk;
      })
    } catch (error) {
      this.isSubmitting.set(false);
      this.assistantOutput.nativeElement.textContent = 'Error tente novamente mais tarde.';
    } finally {
      this.isSubmitting.set(false);
    }
    return;
  }
}
