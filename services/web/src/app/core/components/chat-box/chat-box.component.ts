import { NgClass } from '@angular/common';
import { AfterViewChecked, Component, ElementRef, signal, ViewChild } from '@angular/core';
import { IAChatService } from '../../../services/iachat/iachat.service';
import { LoadingSpinnerComponent } from "../loading-spinner/loading-spinner.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ModalComponent } from "../modal/modal.component";
import { PrimaryInputComponent } from "../inputs/primary-input/primary-input.component";
import { EnumTranslations } from '../../../translations/enum-translations';
import { getEnumOptions } from '../../utils/enum-options';
import { Department } from '../../enums/department.enum';
import { SelectInputComponent } from "../inputs/select-input/select-input.component";
import { Category } from '../../enums/category.enum';
import { TextareaInputComponent } from "../inputs/textarea-input/textarea-input.component";
import { ButtonGreenComponent } from "../button-green/button-green.component";

interface RecommendationForm {
  companyName: FormControl;
  department: FormControl;
  interestedIn: FormControl;
  productsGenerated: FormControl;
  description: FormControl;
}

@Component({
  selector: 'app-chat-box',
  imports: [
    NgClass,
    LoadingSpinnerComponent,
    ReactiveFormsModule,
    ModalComponent,
    PrimaryInputComponent,
    SelectInputComponent,
    TextareaInputComponent,
    ButtonGreenComponent
],
  templateUrl: './chat-box.component.html',
})
export class ChatBoxComponent implements AfterViewChecked {
  protected isOpen = signal(false);
  protected userInput = signal('');
  protected userMessage = signal('');
  protected isSubmitting = signal(false);
  protected isModalOpen = signal(false);
  form!: FormGroup<RecommendationForm>;
  departmentOptions = getEnumOptions(Department, EnumTranslations.Department);
  categoryOptions = getEnumOptions(Category, EnumTranslations.Category);
  interestedIn = [
    { value: 'sell_materials', label: 'Vender resíduos ou materiais reaproveitáveis' },
    { value: 'buy_sustainable_inputs', label: 'Comprar insumos sustentáveis (reciclados, reaproveitados)' },
    { value: 'improve_sustainability_practices', label: 'Melhorar práticas de sustentabilidade interna' },
    { value: 'obtain_certifications', label: 'Obter certificações ESG ou ambientais' },
  ];

  @ViewChild('chatContainer') chatContainerRef!: ElementRef<HTMLDivElement>
  @ViewChild('output') assistantOutput!: ElementRef<HTMLParagraphElement>

  constructor(
    private readonly chat: IAChatService
  ) {
    this.form = new FormGroup<RecommendationForm>({
      companyName: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      interestedIn: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      productsGenerated: new FormControl('', [Validators.required]),
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainerRef && this.chatContainerRef.nativeElement) {
        const chatContainer = this.chatContainerRef.nativeElement;
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 100);
  }

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

  async onSubmitRecommendation() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    const recommendation = {
      name: payload.companyName,
      department: payload.department,
      interestedValue: payload.interestedIn,
      interestedLabel: this.interestedIn.find(option => option.value === payload.interestedIn)?.label || '',
      productsGenerated: payload.productsGenerated,
      description: payload.description
    }

    this.isModalOpen.set(false);
    this.isSubmitting.set(true)
    this.assistantOutput.nativeElement.textContent = '';

    try {
      await this.chat.sendRecommendationStream(recommendation, (chunk) => {
        this.assistantOutput.nativeElement.textContent += chunk;
      })
    } catch (error) {
      this.isSubmitting.set(false);
      this.assistantOutput.nativeElement.textContent = 'Error tente novamente mais tarde.';
    } finally {
      this.isSubmitting.set(false);
      this.form.reset();
    }
    return;
  }

  closeModal() {
    this.isModalOpen.set(false);
  }
}
