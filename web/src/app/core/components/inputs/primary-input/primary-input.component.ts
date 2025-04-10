import { Component, forwardRef, input, Input } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective } from 'ngx-mask';

type InputTypes = "text" | "email" | "password"

@Component({
  selector: 'app-primary-input',
  imports: [
    ReactiveFormsModule,
    NgxMaskDirective,
  ],
  templateUrl: './primary-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PrimaryInputComponent),
      multi: true
    }
  ]
})
export class PrimaryInputComponent implements ControlValueAccessor {
  type = input.required<InputTypes>();
  placeholder = input.required<string>();
  label = input.required<string>();
  inputName = input.required<string>();
  error = input.required<boolean>();
  errorMessage = input.required<string>();
  mask = input<string>();

  value: string = ''
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
