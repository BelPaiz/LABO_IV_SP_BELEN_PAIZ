import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenarFechas',
  standalone: true
})
export class OrdenarFechasPipe implements PipeTransform {

  transform(value: any[], fechaField: string): any[] {
    if (!value || value.length === 0) return value;

    return value.sort((a, b) => {
      const dateA = this.parseDate(a[fechaField]);
      const dateB = this.parseDate(b[fechaField]);
      return dateA.getTime() - dateB.getTime();
    });
  }

  // Convertir dd/MM/yyyy al formato Date
  private parseDate(dateString: string): Date {
    const [day, month, year] = dateString.split('/').map(num => parseInt(num, 10));
    return new Date(year, month - 1, day); // El mes en JavaScript es base 0
  }

}
