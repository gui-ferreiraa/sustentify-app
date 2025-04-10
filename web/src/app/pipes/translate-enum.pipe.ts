import { Pipe, PipeTransform } from '@angular/core';
import { EnumTranslations } from '../translations/enum-translations';

@Pipe({
  name: 'translateEnum',
  standalone: true,
})
export class TranslateEnumPipe implements PipeTransform {
  transform(value: string | null | undefined, type: keyof typeof EnumTranslations): string {
    if (!value) return '-';

    const upperValue = value.toUpperCase();
    const dictionary = EnumTranslations[type];

    return dictionary[upperValue as keyof typeof dictionary] ?? value;
  }
}
