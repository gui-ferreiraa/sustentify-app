import { Component, EventEmitter, input, Output, signal } from '@angular/core';
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
import { forkJoin, of, switchMap } from 'rxjs';
import { IProduct } from '../../../../../core/types/product';
import { ModalComponent } from "../../../../../core/components/modal/modal.component";

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
  selector: 'app-product-form',
  imports: [PrimaryInputComponent, ReactiveFormsModule, SelectInputComponent, ButtonGreenComponent, TextareaInputComponent, ImageUploadInputComponent, ModalComponent],
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent {
  isOpen = input(false);
  @Output() clickedOutside = new EventEmitter<void>();
  @Output() successfully = new EventEmitter<IProduct>();
  form!: FormGroup<ProductForm>;
  categoryOptions = getEnumOptions(Category, EnumTranslations.Category);
  conditionOptions = getEnumOptions(Condition, EnumTranslations.Condition);
  materialOptions = getEnumOptions(Material, EnumTranslations.Material);
  buttonDisabled = signal(false);

  constructor(
    private readonly productsService: ProductsService,
    private readonly toastService: ToastrService,
  ) {
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
  }

  private prepareFormPayload(): any {
    const fields = this.form.getRawValue();
    return {
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
    this.productsService.fetchProductCreate(payload).pipe(
      switchMap(product => {
        const uploadRequests = [];

        if (this.form.value.thumbnail) {
          uploadRequests.push(this.productsService.fetchUploadThumbnail(product.id, this.form.value.thumbnail));
        }

        if (this.form.value.images && this.form.value.images.length > 0) {
          uploadRequests.push(this.productsService.fetchUploadImages(product.id, this.form.value.images));
        }

        return uploadRequests.length
          ? forkJoin(uploadRequests).pipe(switchMap(() => this.productsService.fetchProductDetails(product.id)))
          : of(product);
      })
    ).subscribe({
      next: (createdProduct) => {
        this.toastService.success('Produto criado com sucesso!');
        this.successfully.emit(createdProduct);
      },
      error: () => this.toastService.error('Erro ao criar produto ou enviar imagens.'),
      complete: () => this.buttonDisabled.set(false),
    });
  }
};
