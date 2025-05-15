import { Component, forwardRef, input, Input } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

type InputTypes = "text" | "email" | "password" | "date" | "number"

@Component({
  standalone: true,
  selector: 'app-primary-input',
  imports: [
    ReactiveFormsModule,
    NgxMaskDirective,
    FormsModule,
  ],
  templateUrl: './primary-input.component.html',
  providers: [
    provideNgxMask(),
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
  isDisabled = false;
  errorMessage = input.required<string>();
  mask = input<string>();
  thousandSeparator = input<string>();
  decimalMarker = input<'.' | ',' | ['.', ',']>();
  prefix = input<string>();


  value: string = ''
  onChange: any = () => {}
  onTouched: any = () => {}

  onInput(event: Event){
    const value = (event.target as HTMLInputElement).value

    const valueFormat = value
      .replace("R$ ", '')

    this.onChange(valueFormat)
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

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled
  }

}
