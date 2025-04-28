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
import { ImageUploadInputComponent } from "../../../core/components/inputs/image-upload-input/image-upload-input.component";
import { fileTypeValidator } from '../../../core/validators/filteType.validator';
import { finalize, forkJoin, of, switchMap } from 'rxjs';
import { IHttpError } from '../../../core/types/http-error';

interface SignupForm {
  cnpj: FormControl;
  name: FormControl;
  email: FormControl;
  location: FormControl;
  department: FormControl;
  phone: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  file: FormControl;
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
    ImageUploadInputComponent
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
      file: new FormControl<File | null>(null, [Validators.required, fileTypeValidator(['image/png', 'image/jpeg', 'image/jpg', 'application/pdf'])]),
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
    }, fields.file).pipe(
      finalize(() => this.btnDisabled.set(false))
    ).subscribe({
      next: () => {
        this.toastService.success("Cadastro concluído! Validaremos suas informações e em breve você poderá acessar a plataforma.");
        this.router.navigate(['/signin']);
      },
      error: (err) => this.handleError(err)
    });
  }

  private handleError(err: IHttpError): void {
    const errorMessages: Record<string, string> = {
      409: 'Compania já cadastrada!',
      403: 'Compania Já cadastrada!'
    };

    const key = err.status;
    const message = errorMessages[key] || 'Erro interno no servidor. Tente novamente mais tarde.'

    this.toastService.error(message);
  }
}
