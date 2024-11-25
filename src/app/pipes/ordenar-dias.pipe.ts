import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'ordenarDias',
  standalone: true
})
export class OrdenarDiasPipe implements PipeTransform {

  // Mapa para ordenar los días de lunes a sábado
  private diasOrdenados: Record<string, number> = {
    'lunes': 1,
    'martes': 2,
    'miércoles': 3,
    'jueves': 4,
    'viernes': 5,
    'sábado': 6,
  };

  transform(value: any[], diaField: string): any[] {
    if (!value || value.length === 0) return value;

    // Filtrar para obtener solo la primera aparición de cada día
    const unicos = this.filtrarUnicos(value, diaField);

    // Ordenar los días de lunes a sábado
    return unicos.sort((a, b) => {
      const diaA = this.diasOrdenados[a[diaField].toLowerCase()] || 0;
      const diaB = this.diasOrdenados[b[diaField].toLowerCase()] || 0;
      return diaA - diaB;
    });
  }

  private filtrarUnicos(value: any[], diaField: string): any[] {
    const vistos = new Set<string>();
    return value.filter(item => {
      const dia = item[diaField].toLowerCase();
      if (!vistos.has(dia)) {
        vistos.add(dia);
        return true; // Primera vez que vemos este día
      }
      return false; // Día ya visto, lo excluimos
    });
  }
}
