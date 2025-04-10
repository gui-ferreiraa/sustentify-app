import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TitleDisplayComponent } from "../../../core/components/title-display/title-display.component";
import { TextColor } from '../../../core/types/enums';
import { ButtonGreenComponent } from "../../../core/components/button-green/button-green.component";
import { PrimaryInputComponent } from '../../../core/components/inputs/primary-input/primary-input.component';
import { SelectInputComponent } from "../../../core/components/inputs/select-input/select-input.component";
import { getEnumOptions } from '../../../core/utils/enum-options';
import { Department } from '../../../core/enums/department.enum';
import { EnumTranslations } from '../../../translations/enum-translations';
import { CompaniesService } from '../../../services/companies/companies.service';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

interface SignupForm {
  cnpj: FormControl;
  name: FormControl;
  email: FormControl;
  location: FormControl;
  department: FormControl;
  phone: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  terms: FormControl;
}

@Component({
  selector: 'app-signup',
  imports: [
    NgOptimizedImage,
    ReactiveFormsModule,
    TitleDisplayComponent,
    ButtonGreenComponent,
    PrimaryInputComponent,
    SelectInputComponent,
],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
  signupTexts = {
    title: 'Crie sua conta',
    subtitle: 'Dê o Primeiro Passo para um Negócio Mais Sustentável',
    titleColor: TextColor.black,
    subtitleColor: TextColor.gray
  }

  form!: FormGroup<SignupForm>;
  departmentOptions = getEnumOptions(Department, EnumTranslations.Department);

  constructor(
    private readonly companiesService: CompaniesService
  ) {
    this.form = new FormGroup({
      cnpj: new FormControl('', [Validators.required, Validators.pattern(/^\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}$/
)]),
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPassword: new FormControl('', [Validators.required]),
      department: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.pattern(/^\+55\s?\(\d{2}\)\s?\d{5}-\d{4}$/
)]),
      terms: new FormControl(false, [Validators.requiredTrue])
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
