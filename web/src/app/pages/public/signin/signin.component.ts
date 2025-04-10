import { Component } from '@angular/core';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { TextColor } from '../../../core/types/enums';
import { PrimaryInputComponent } from "../../../core/components/inputs/primary-input/primary-input.component";
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgOptimizedImage } from '@angular/common';

interface SigninForm {
  email: FormControl;
  password: FormControl;
}

@Component({
  selector: 'app-signin',
  imports: [
    TitleDisplayComponent,
    PrimaryInputComponent,
    ButtonGreenComponent,
    ReactiveFormsModule,
    NgOptimizedImage
  ],
  templateUrl: './signin.component.html',
})
export class SigninComponent {
  signinTexts = {
    title: 'Acesse sua conta',
    subtitle: 'Entre e Comece a Transformar o Impacto Ambiental da Sua Empresa',
    titleColor: TextColor.black,
    subtitleColor: TextColor.gray
  }

  form!: FormGroup<SigninForm>;

  constructor() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    })
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    console.log(this.form.getRawValue());
  }
}
