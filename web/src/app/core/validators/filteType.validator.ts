import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function fileTypeValidator(acceptedTypes: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const file = control.value as File;

    if (!file) return null;

    if (!acceptedTypes.includes(file.type)) {
      return { invalidFileType: true }
    }

    return null;
  }
}
