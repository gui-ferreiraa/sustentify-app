import { Component, EventEmitter, Input, input, OnInit, Output, signal } from '@angular/core';
import { PrimaryInputComponent } from "../../../../../core/components/inputs/primary-input/primary-input.component";
import { Category } from '../../../../../core/enums/category.enum';
import { Condition } from '../../../../../core/enums/condition.enum';
import { Material } from '../../../../../core/enums/material.enum';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getEnumOptions } from '../../../../../core/utils/enum-options';
import { EnumTranslations } from '../../../../../translations/enum-translations';
import { SelectInputComponent } from '../../../../../core/components/inputs/select-input/select-input.component';
import { ButtonGreenComponent } from "../../../../../core/components/button-green/button-green.component";
import { ProductsService } from '../../../../../services/product/products.service';
import { TextareaInputComponent } from "../../../../../core/components/inputs/textarea-input/textarea-input.component";
import { ImageUploadInputComponent } from "../../../../../core/components/inputs/image-upload-input/image-upload-input.component";
import { ToastrService } from 'ngx-toastr';
import { IProduct } from '../../../../../core/types/product';

interface ProductForm {
  name: FormControl;
  category: FormControl;
  condition: FormControl;
  material: FormControl;
  productionDate: FormControl;
  price: FormControl;
  location: FormControl;
  quantity: FormControl;
  description: FormControl;
  thumbnail: FormControl<File | null>;
  images: FormControl<File[] | null>;
}

@Component({
  selector: 'app-product-update-form',
  imports: [PrimaryInputComponent, ReactiveFormsModule, SelectInputComponent, ButtonGreenComponent, TextareaInputComponent, ImageUploadInputComponent],
  templateUrl: './product-update-form.component.html',
})
export class ProductUpdateFormComponent implements OnInit {
  form!: FormGroup<ProductForm>;
  categoryOptions = getEnumOptions(Category, EnumTranslations.Category);
  conditionOptions = getEnumOptions(Condition, EnumTranslations.Condition);
  materialOptions = getEnumOptions(Material, EnumTranslations.Material);
  buttonDisabled = signal(false);
  @Output() onSubmit = new EventEmitter<IProduct>();
  productInput = input.required<IProduct | null>();

  constructor(
    private readonly productsService: ProductsService,
    private readonly toastService: ToastrService,
  ) {

  }

  ngOnInit() {
    this.form = new FormGroup({
      category: new FormControl('', [Validators.required]),
      condition: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      material: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      productionDate: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      thumbnail: new FormControl<File | null>(null, []),
      images: new FormControl<File[] | null>([], []),
    })

    if (this.productInput()) {
      this.form.patchValue({
        category: this.productInput()?.category,
        condition: this.productInput()?.condition,
        location: this.productInput()?.location,
        material: this.productInput()?.material,
        name: this.productInput()?.name,
        price: this.productInput()?.price,
        productionDate: this.productInput()?.productionDate,
        quantity: this.productInput()?.quantity,
        description: this.productInput()?.description,
      });
    }
  }

  private prepareFormPayload(): any {
    const fields = this.form.getRawValue();
    return {
      id: this.productInput()?.id,
      category: fields.category,
      condition: fields.condition,
      description: fields.description,
      location: fields.location,
      material: fields.material,
      name: fields.name,
      price: fields.price,
      productionDate: new Date(fields.productionDate).toISOString(),
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
    this.productsService.fetchUpdateProduct(payload)
      .subscribe({
      next: (response) => {
        this.toastService.success('Produto atualizado com sucesso!');
        this.onSubmit.emit();
      },
      error: (err) => {
        this.toastService.error('Erro ao atualizar produto')
        this.buttonDisabled.set(false)
      },
      complete: () => this.buttonDisabled.set(false),
    });
  }
};
