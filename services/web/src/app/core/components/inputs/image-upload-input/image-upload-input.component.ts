import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-image-upload-input',
  imports: [],
  templateUrl: './image-upload-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadInputComponent),
      multi: true
    }
  ]
})
export class ImageUploadInputComponent implements ControlValueAccessor {
  placeholder = input.required<string>();
  label = input.required<string>();
  inputName = input.required<string>();
  multiple = input.required<boolean>();
  error = input.required<boolean>();
  errorMessage = input.required<string>();

  value: File | File[] | null = null;
  onChange: any = () => {}
  onTouched: any = () => {}

  onInput(event: Event){
    let files = (event.target as HTMLInputElement).files;

    if (!files) return;

    if (this.multiple()) {
      this.value = Array.from(files);
      this.onChange(this.value);
      return;
    }

    this.value = files[0];

    this.onChange(this.value);
  }

  writeValue(value: any): void {
    this.value = value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn
  }

  setDisabledState(isDisabled: boolean): void {}
}
