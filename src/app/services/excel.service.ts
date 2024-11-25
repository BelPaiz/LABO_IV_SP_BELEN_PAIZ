import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import saveAs from 'file-saver';


@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  exportarCSV(data: any[], nombre_archivo: string, campos: string[]): void {
    // Filtrar los campos deseados
    const filteredData = data.map((item) => {
      const filteredItem: any = {};
      campos.forEach((field) => {
        filteredItem[field] = item[field];
      });
      return filteredItem;
    });

    // Convertir a formato CSV
    const csvData = this.convertToCSV(filteredData);

    // Crear un Blob y descargarlo
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${nombre_archivo}.csv`);
  }

  private convertToCSV(data: any[]): string {
    if (!data || data.length === 0) return '';

    const headers = Object.keys(data[0]).join(','); // Crear la fila de encabezados
    const rows = data.map((row) =>
      Object.values(row)
        .map((value) => `"${value}"`) // Escapar valores
        .join(',')
    );
    return `${headers}\n${rows.join('\n')}`; // Combinar encabezados y filas
  }
}

