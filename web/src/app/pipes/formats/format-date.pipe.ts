import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate',
  standalone: true
})
export class FormatDatePipe implements PipeTransform {
  transform(value: string): string {
    return new Date(value).toLocaleDateString('pt-BR', {
      dateStyle: 'medium'
    });
  }
}
