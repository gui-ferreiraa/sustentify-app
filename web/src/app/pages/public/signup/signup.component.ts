import { NgOptimizedImage } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
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
import { confirmPasswordValidator } from '../../../core/validators/confirmPassword.validator';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

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
export class SignupComponent implements OnInit {
  signupTexts = {
    title: 'Crie sua conta',
    subtitle: 'Dê o Primeiro Passo para um Negócio Mais Sustentável',
    titleColor: TextColor.black,
    subtitleColor: TextColor.gray
  }

  form!: FormGroup<SignupForm>;
  btnDisabled = signal(false);
  departmentOptions = getEnumOptions(Department, EnumTranslations.Department);

  constructor(
    private readonly companiesService: CompaniesService,
    private readonly toastService: ToastrService,
    private readonly router: Router,
    private readonly titleService: Title,
    private readonly metaService: Meta,
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
    }, { validators: confirmPasswordValidator() })
  }

  ngOnInit(): void {
    this.titleService.setTitle('Cadastro - Sustentify');
    this.metaService.updateTag({ name: 'description', content: 'Crie sua conta na Sustentify e comece a contribuir para um futuro mais sustentável.' });
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fields = this.form.getRawValue();

    this.btnDisabled.set(true);
    this.companiesService.create({
      address: fields.location,
      cnpj: fields.cnpj,
      companyDepartment: fields.department,
      email: fields.email,
      name: fields.name,
      phone: fields.phone,
      password: fields.password
    }).subscribe({
      next: (vl) => {
        if (vl.successfully) {
          this.toastService.success("Cadastro realizado com sucesso!");
          this.router.navigate(['/signin'])
        }
      },
      error: (err) => {
        if (err.status == 500) {
          this.toastService.error("Erro ao fazer login, tente novamente mais tarde");
          this.btnDisabled.set(false);
        }
        if (err.error.status == 'CONFLICT') this.toastService.error("Email ja cadastrado!");
        else if (err.error.status == 'BAD_REQUEST') this.toastService.error("CNPJ inválido!");
        else if (err.error.status == 'FORBIDDEN') this.toastService.error("CNPJ já cadastrado!");
        else this.toastService.error("Erro ao cadastrar empresa! Tente novamente mais tarde.");

        this.btnDisabled.set(false);
      },
      complete: () => this.btnDisabled.set(false),
    })
  }
}
