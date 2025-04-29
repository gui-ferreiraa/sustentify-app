import { Component, OnInit, signal } from '@angular/core';
import { TextColor } from '../../../core/types/enums';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { PrimaryInputComponent } from "../../../core/components/inputs/primary-input/primary-input.component";
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { NgOptimizedImage } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TextareaInputComponent } from "../../../core/components/inputs/textarea-input/textarea-input.component";
import { Meta, Title } from '@angular/platform-browser';
import { SelectInputComponent } from "../../../core/components/inputs/select-input/select-input.component";
import { EmailService } from '../../../services/email/email.service';
import { EmailAttemptService } from '../../../services/email-attempt/email-attempt.service';

interface ContactForm {
  phone: FormControl;
  name: FormControl;
  subject: FormControl;
  message: FormControl;
  email: FormControl;
}

@Component({
  selector: 'app-contact',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    TitleDisplayComponent,
    PrimaryInputComponent,
    ButtonGreenComponent,
    TextareaInputComponent,
    SelectInputComponent
],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  contact = {
    title: 'Fale Conosco',
    titleColor: TextColor.black,
    subtitle: 'contato',
    subtitleColor: TextColor.gray,
  }
  protected readonly subjectOptions = [
    { label: 'Empregos', value: 'job'},
    { label: 'Sustentabilidade', value: 'sustantability'},
    { label: 'Produtos', value: 'products'},
    { label: 'Empresas', value: 'companies'},
  ];
  protected contactForm!: FormGroup<ContactForm>;
  protected isSubmitting = signal(false);

  constructor(
    private toastService: ToastrService,
    private readonly titleService: Title,
    private readonly metaService: Meta,
    private readonly mail: EmailService,
    private readonly mailAttempt: EmailAttemptService,
  ) {
    this.contactForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
      message: new FormControl('', [Validators.required, Validators.minLength(15)]),
      name: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.titleService.setTitle('Contato | Sustentify');
    this.metaService.updateTag({ name: 'description', content: 'Fale com a equipe Sustentify. Tire dúvidas, envie sugestões ou saiba como podemos colaborar.' });
  }

  submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.toastService.error('Preencha os campos obrigatórios corretamente.');
      return;
    }

    const fields = this.contactForm.getRawValue();

    if (this.mailAttempt.hasRecentAttempt()) return;

    this.isSubmitting.set(true);
    this.mail.send(fields).subscribe({
      next: (vl) => {
        this.toastService.success('Email Enviado!');
      },
      error: (err) => {
        this.toastService.success('Erro ao Enviar Email!');
        this.isSubmitting.set(false);
        this.contactForm.reset();
      },
      complete: () => {
        this.isSubmitting.set(false);
        this.contactForm.reset();
      }
    })
  }
}
