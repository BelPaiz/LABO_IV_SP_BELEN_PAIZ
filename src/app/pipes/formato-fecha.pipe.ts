import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoFecha',
  standalone: true
})
export class FormatoFechaPipe implements PipeTransform {

  transform(fechaString: string): string {
    if (!fechaString) return '';

    const [dia, mes] = fechaString.split('/'); // Separar el día y el mes
    return `${dia}/${mes}`; // Retornar solo el día y el mes
  }

}
