import { Component, EventEmitter, input, OnInit, Output, signal } from '@angular/core';
import { PrimaryInputComponent } from "../../../../../core/components/inputs/primary-input/primary-input.component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { getEnumOptions } from '../../../../../core/utils/enum-options';
import { Department } from '../../../../../core/enums/department.enum';
import { EnumTranslations } from '../../../../../translations/enum-translations';
import { SelectInputComponent } from "../../../../../core/components/inputs/select-input/select-input.component";
import { ButtonGreenComponent } from "../../../../../core/components/button-green/button-green.component";
import { ICompany } from '../../../../../core/types/company';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../../services/auth/auth.service';
import { CompaniesService } from '../../../../../services/companies/companies.service';
import { ToastrService } from 'ngx-toastr';
import { ModalComponent } from "../../../../../core/components/modal/modal.component";

interface EditProfileForm {
  name: FormControl;
  address: FormControl;
  companyDepartment: FormControl;
  phone: FormControl;
}

@Component({
  selector: 'app-profile-update-form',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    PrimaryInputComponent,
    SelectInputComponent,
    ButtonGreenComponent,
    ModalComponent
],
  templateUrl: './profile-update-form.component.html',
})
export class ProfileUpdateFormComponent implements OnInit {
  protected company$!: Observable<ICompany | null>;
  form!: FormGroup<EditProfileForm>;
  protected departmentOptions = getEnumOptions(Department, EnumTranslations.Department);
  protected btnDisabled = signal(false);
  isOpen = input(false);
  @Output() clickedOutside = new EventEmitter<void>();
  @Output() successfully = new EventEmitter<void>();

  constructor(
    private readonly authService: AuthService,
    private readonly companiesService: CompaniesService,
    private readonly toastService: ToastrService,
  ) {}

  ngOnInit(): void {
    this.company$ = this.authService.company$;

    this.company$.subscribe({
      next: (company) => {
        if (company) {
          this.form = new FormGroup({
            name: new FormControl(company.name, { nonNullable: true }),
            address: new FormControl(company.address, { nonNullable: true }),
            companyDepartment: new FormControl(company.companyDepartment, { nonNullable: true }),
            phone: new FormControl(company.phone, { nonNullable: true, validators: [Validators.pattern(/^\+55\s?\(\d{2}\)\s?\d{5}-\d{4}$/
            )]})
          });
        }
      }
    })
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const fields = this.form.getRawValue();
    this.btnDisabled.set(true);

    this.company$.subscribe(company => {
      if (!company) {
        return;
      }

      this.companiesService.update(fields).subscribe({
        next: () => {
          this.toastService.success('Perfil atualizado com sucesso!');
          this.successfully.emit();
        },
        error: (err) => {
          this.toastService.error('Erro ao atualizar perfil!'),
          this.btnDisabled.set(false);
        },
        complete: () => this.btnDisabled.set(false)
      });
    })

  }
}
