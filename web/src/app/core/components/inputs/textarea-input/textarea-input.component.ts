import { Component, forwardRef, input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-textarea-input',
  imports: [ReactiveFormsModule],
  templateUrl: './textarea-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaInputComponent),
      multi: true
    }
  ]
})
export class TextareaInputComponent implements ControlValueAccessor {
  placeholder = input.required<string>();
  label = input.required<string>();
  inputName = input.required<string>();
  error = input.required<boolean>();
  errorMessage = input.required<string>();

  value: string = ''

  constructor() {}

  onChange: any = () => {}

  onTouched: any = () => {}

  onInput(event: Event){
    const value = (event.target as HTMLInputElement).value
    this.onChange(value)
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
