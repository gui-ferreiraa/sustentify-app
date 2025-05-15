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
import { firstValueFrom } from 'rxjs';
import { ModalManagerService } from '../../../../../services/modal-manager/modal-manager.service';

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
  isSubmitting = signal(false);

  protected readonly modalIsOpen = signal(false);
  protected selectedImageDelete = signal<IProductImage & { type: 'thumbnail' | 'image' } | null>(null);

  constructor(
    private readonly productsService: ProductsService,
    private readonly toastService: ToastrService,
    protected readonly modalManager: ModalManagerService,
  ) {
  }

  ngOnInit() {
    this.form = this.createProductForm();

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
  }

  private createProductForm(): FormGroup<ProductForm> {
    return new FormGroup<ProductForm>({
      category: new FormControl('', [Validators.required]),
      condition: new FormControl('', [Validators.required]),
      location: new FormControl('', [Validators.required]),
      material: new FormControl('', [Validators.required]),
      name: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required, Validators.maxLength(12)]),
      productionDate: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      thumbnail: new FormControl<File | null>(null),
      images: new FormControl<File[] | null>(null),
    });
  }

  private buildUpdatePayload(): any {
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
      quantity: fields.quantity,
    }
  };

  async submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    const payload = this.buildUpdatePayload();
    const { images, thumbnail } = this.form.getRawValue();

    try {
      this.handleImageUploads(payload.id, images, thumbnail);

      await firstValueFrom(this.productsService.fetchProductUpdate(payload));
      this.toastService.success('Produto atualizado com sucesso!');
      this.successfully.emit();
    } catch (err) {
      this.toastService.error('Erro ao atualizar produto');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  private handleImageUploads(productId: string, images: File[] | null, thumbnail: File | null): void {
    try {
      if (images) {
        this.productsService.fetchUploadImages(productId, images).subscribe({
          error: () => this.toastService.error('Imagem não enviada')
        });
      }
      if (thumbnail) {
        this.productsService.fetchUploadThumbnail(productId, thumbnail).subscribe({
          error: () => this.toastService.error('Thumbnail não enviada')
        });
      }
    } catch (error) {
      throw new Error('Erro ao enviar imagens');
    }
  }

  handleRemoveImage(type: 'thumbnail' | 'image', image?: IProductImage) {
    if (!image) return;

    this.selectedImageDelete.set({
      type,
      ...image,
    })
    this.modalManager.open('deleteImage');
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
            this.modalManager.close('deleteImage');
          },
          complete: () => {
            this.selectedImageDelete.set(null);
            this.modalManager.close('deleteImage');
            this.clickedOutside.emit();
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
            this.modalManager.close('deleteImage');
          },
          complete: () => {
            this.selectedImageDelete.set(null);
            this.modalManager.close('deleteImage');
            this.clickedOutside.emit();
          },
        })
      }

      return;
    }
  }
};
