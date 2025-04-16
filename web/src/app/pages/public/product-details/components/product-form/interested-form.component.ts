import { Component, EventEmitter, input, Output, signal } from '@angular/core';
import { PrimaryInputComponent } from "../../../../../core/components/inputs/primary-input/primary-input.component";
import { Category } from '../../../../../core/enums/category.enum';
import { Condition } from '../../../../../core/enums/condition.enum';
import { Material } from '../../../../../core/enums/material.enum';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getEnumOptions } from '../../../../../core/utils/enum-options';
import { EnumTranslations } from '../../../../../translations/enum-translations';
import { ButtonGreenComponent } from "../../../../../core/components/button-green/button-green.component";
import { TextareaInputComponent } from "../../../../../core/components/inputs/textarea-input/textarea-input.component";
import { ToastrService } from 'ngx-toastr';
import { InterestedProductsService } from '../../../../../services/interested/interested-products.service';
import { ActivatedRoute } from '@angular/router';

interface ProductForm {
  message: FormControl;
  quantity: FormControl;
}

@Component({
  selector: 'app-interested-form',
  imports: [PrimaryInputComponent, ReactiveFormsModule, ButtonGreenComponent, TextareaInputComponent],
  templateUrl: './interested-form.component.html',
})
export class InterestedFormComponent {
  form!: FormGroup<ProductForm>;
  categoryOptions = getEnumOptions(Category, EnumTranslations.Category);
  conditionOptions = getEnumOptions(Condition, EnumTranslations.Condition);
  materialOptions = getEnumOptions(Material, EnumTranslations.Material);
  buttonDisabled = signal(false);
  productId = input.required<number>();
  @Output() onSubmit = new EventEmitter<void>();

  constructor(
    private readonly interestedService: InterestedProductsService,
    private readonly toastService: ToastrService,
  ) {
    this.form = new FormGroup({
      message: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
    })
  }

  private prepareFormPayload(): any {
    const fields = this.form.getRawValue();
    return {
      message: fields.message,
      quantity: fields.quantity
    }
  };

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.prepareFormPayload();

    this.buttonDisabled.set(true);

    this.interestedService.fetchInterestedCreate({
      productId: this.productId(),
      quantity: payload.quantity
    }).subscribe({
      next: (value) => {
        this.toastService.success('Interesse Registrado!');
        this.onSubmit.emit();
      },
      error: (err) => {
        if (err.error.status === 'CONFLICT') {
          this.toastService.error('Erro: Interesse já registrado!');
          this.buttonDisabled.set(false);
        }
      },
      complete: () => this.buttonDisabled.set(false),
    })
  }
};
