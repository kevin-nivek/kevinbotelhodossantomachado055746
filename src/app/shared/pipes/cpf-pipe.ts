import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cpf',
})
export class CpfPipe implements PipeTransform {

  transform(value: string | number | null): string {
    if (!value) return '';

    const cpf = value.toString().replace(/\D/g, '');

    if (cpf.length === 11) {
      return cpf.replace(
        /(\d{3})(\d{3})(\d{3})(\d{2})/,
        '$1.$2.$3-$4'
      );
    }



    return value.toString();
  }

}
