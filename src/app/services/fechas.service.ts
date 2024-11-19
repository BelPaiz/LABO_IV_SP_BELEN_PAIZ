import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FechasService {

  constructor() { }

  traerProximos(hoy: Date): { dia: string, fecha: string }[] {
    const proximos: { dia: string, fecha: string }[] = [];

    const fechaInicial = new Date(hoy);
    fechaInicial.setDate(fechaInicial.getDate() + 1);

    for (let i = 0; i < 15; i++) {
      const currentDate = new Date(fechaInicial);
      currentDate.setDate(fechaInicial.getDate() + i);

      const dia = this.obtenerNombreDia(currentDate);
      const fecha = this.formatearFecha(currentDate);

      proximos.push({ dia, fecha });
    }

    return proximos;
  }

  private obtenerNombreDia(date: Date): string {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    return diasSemana[date.getDay()];
  }

  private formatearFecha(date: Date): string {
    const dia = date.getDate().toString().padStart(2, '0');
    const mes = (date.getMonth() + 1).toString().padStart(2, '0');
    const anio = date.getFullYear().toString();
    return `${dia}/${mes}/${anio}`;
  }
}
