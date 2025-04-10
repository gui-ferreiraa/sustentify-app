import { Component } from '@angular/core';
import { TextColor } from '../../../core/types/enums';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { PrimaryInputComponent } from "../../../core/components/inputs/primary-input/primary-input.component";
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Event, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TextareaInputComponent } from "../../../core/components/inputs/textarea-input/textarea-input.component";

interface ContactForm {
  location: FormControl;
  name: FormControl;
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
    TextareaInputComponent
],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  contact = {
    title: 'Fale Conosco',
    titleColor: TextColor.black,
    subtitle: 'contato',
    subtitleColor: TextColor.gray,
  }

  contactForm!: FormGroup<ContactForm>;

  constructor(
    private router: Router,
    private toastService: ToastrService
  ) {
    this.contactForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      location: new FormControl('', [Validators.required, Validators.minLength(10)]),
      message: new FormControl('', [Validators.required, Validators.minLength(15)]),
      name: new FormControl('', [Validators.required])
    })
  }

  submit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      this.toastService.error('Preencha os campos obrigatórios corretamente.');
      return;
    }

    console.log(this.contactForm.getRawValue());
    this.toastService.success('Email Enviado!');
  }
}
