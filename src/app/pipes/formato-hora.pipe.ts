import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatoHora',
  standalone: true
})
export class FormatoHoraPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return value; // Manejar caso donde no haya valor

    const [hour, minute] = value.split(':').map(Number); // Separar hora y minutos
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12; // Convertir 0 o 24 a 12
    return `${formattedHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  }

}
