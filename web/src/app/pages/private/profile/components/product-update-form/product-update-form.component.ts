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
import { IProduct, IProductImage } from '../../../../../core/types/product';
import { NgOptimizedImage } from '@angular/common';
import { ModalComponent } from "../../../../../core/components/modal/modal.component";
import { ModalDeleteComponent } from "../../../../../core/components/modal-delete/modal-delete.component";

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
  imports: [PrimaryInputComponent, ReactiveFormsModule, SelectInputComponent, ButtonGreenComponent, TextareaInputComponent, ImageUploadInputComponent, NgOptimizedImage, ModalDeleteComponent, ModalComponent],
  templateUrl: './product-update-form.component.html',
})
export class ProductUpdateFormComponent implements OnInit {
  isOpen = input(false);
  product = input.required<IProduct | null>();
  @Output() successfully = new EventEmitter<IProduct>();
  @Output() clickedOutside = new EventEmitter<void>();
  form!: FormGroup<ProductForm>;
  categoryOptions = getEnumOptions(Category, EnumTranslations.Category);
  conditionOptions = getEnumOptions(Condition, EnumTranslations.Condition);
  materialOptions = getEnumOptions(Material, EnumTranslations.Material);
  buttonDisabled = signal(false);

  protected readonly modalIsOpen = signal(false);
  protected selectedImageDelete = signal<IProductImage & { type: 'thumbnail' | 'image' } | null>(null);

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

    if (this.product()) {
      this.form.patchValue({
        category: this.product()?.category,
        condition: this.product()?.condition,
        location: this.product()?.location,
        material: this.product()?.material,
        name: this.product()?.name,
        price: this.product()?.price,
        productionDate: this.product()?.productionDate,
        quantity: this.product()?.quantity,
        description: this.product()?.description,
      });
    }

    console.log(this.product())
  }

  private prepareFormPayload(): any {
    const fields = this.form.getRawValue();
    return {
      id: this.product()?.id,
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
    this.productsService.fetchProductUpdate(payload)
      .subscribe({
      next: (response) => {
        this.toastService.success('Produto atualizado com sucesso!');
        this.successfully.emit();
      },
      error: (err) => {
        this.toastService.error('Erro ao atualizar produto')
        this.buttonDisabled.set(false)
      },
      complete: () => this.buttonDisabled.set(false),
    });
  }

  openModal() { this.modalIsOpen.set(true) }

  handleRemoveImage(image?: IProductImage, type: 'thumbnail' | 'image' = 'image') {
    if (!image) return;

    this.openModal();
    this.selectedImageDelete.set({
      type,
      ...image,
    })
  }

  deleteThumbnail() {
    const productId = this.product()?.id;
    const image = this.selectedImageDelete();

    if (productId && image) {
      if (image.type === 'thumbnail') {
        this.productsService.fetchUploadDeleteThumbnail(productId, image).subscribe({
          next: (res) => {
            this.toastService.success('Thumbnail deletada com sucesso!');
          },
          error: (err) => {
            this.toastService.error('Erro ao deletar imagem!');
            this.modalIsOpen.set(false);
          },
          complete: () => {
            this.selectedImageDelete.set(null);
            this.modalIsOpen.set(false);
          },
        })
      }
      else if (image.type === 'image') {
        this.productsService.fetchUploadDeleteImage(productId, image).subscribe({
          next: (res) => {
            this.toastService.success('Imagem deletada com sucesso!');
          },
          error: (err) => {
            this.toastService.error('Erro ao deletar imagem!');
            this.modalIsOpen.set(false);
          },
          complete: () => {
            this.selectedImageDelete.set(null);
            this.modalIsOpen.set(false);
          },
        })
      }

      return;
    }
  }
};
