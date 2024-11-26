import { Injectable } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

@Injectable({
  providedIn: 'root'
})
export class PDFService {
  generarPdf(paciente: any, turnos: any[], today: Date, paciente_nom: string): void {
    const doc = new jsPDF();

    // Cargar el logo (asegúrate de tener el logo en Base64 o una ruta válida)
    const logoBase64 = 'data:image/png;base64,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'; // Asegúrate de reemplazar esto con tu logo en Base64
    const logoWidth = 60; // Ancho deseado del logo
    const logoHeight = 30; // Alto deseado del logo

    // Agregar el logo en la parte superior derecha
    const pageWidth = doc.internal.pageSize.width;
    const xPosition = pageWidth - logoWidth - 10; // 10 es el margen desde el borde derecho
    const yPosition = 10; // Posición en Y (parte superior de la página)

    doc.addImage(logoBase64, 'PNG', xPosition, yPosition, logoWidth, logoHeight);

    // Encabezado
    doc.setFontSize(18);
    doc.text('Historia Clínica', 14, 20);

    doc.setFontSize(12);
    const todayText = `Fecha de emisión: ${today.toLocaleDateString()}`;
    if (typeof todayText === 'string') {
      doc.text(todayText, 14, 30);
    }

    // Datos del paciente
    doc.setFontSize(14);
    doc.text('Datos del Paciente:', 14, 40);

    doc.setFontSize(12);
    if (paciente_nom) {
      doc.text(`Nombre: ${paciente_nom}`, 14, 50);
    }

    if (paciente && paciente.edad) {
      doc.text(`Edad: ${paciente.edad} años`, 14, 55);
    }

    if (paciente && paciente.dni) {
      doc.text(`DNI: ${paciente.dni}`, 14, 60);
    }

    if (paciente && paciente.obra_social) {
      doc.text(`Obra Social: ${paciente.obra_social}`, 14, 65);
    }

    // Agregar un pequeño espacio antes de los turnos
    doc.text('', 14, 70); // Espacio en blanco para separación

    // Iterar sobre cada turno para crear una tabla clave-valor
    for (let i = 0; i < turnos.length; i++) {
      if (turnos[i].fecha !== "") {
        const columns = ['Dato', 'Valor'];
        const rows = [
          ['Fecha', turnos[i].fecha],
          ['Hora', `${turnos[i].hora} hs`],
          ['Especialista', turnos[i].especialista],
          ['Especialidad', turnos[i].especialidad],
          ['Presión', `${turnos[i].presion[0]}/${turnos[i].presion[1]}`],
          ['Altura', `${turnos[i].altura} cm`],
          ['Peso', `${turnos[i].peso} kg`],
          ['Temperatura', `${turnos[i].temperatura} °C`],
          ['Comentario', turnos[i].comentario],
          [`${turnos[i].dato_uno[0]}`, `${turnos[i].dato_uno[1]}`],
          [`${turnos[i].dato_dos[0]}`, `${turnos[i].dato_dos[1]}`],
          [`${turnos[i].dato_tres[0]}`, `${turnos[i].dato_tres[1]}`],
        ];

        // Crear la tabla de clave-valor para cada turno
        autoTable(doc, {
          startY: doc.autoTable.previous ? doc.autoTable.previous.finalY + 10 : 80, // Asegurarse de que cada tabla comienza después de la anterior
          head: [columns],
          body: rows,
          margin: { top: 10 },
          didDrawPage: function (data) {
          }
        });

        // Espacio entre turnos (solo si es el último turno, puedes agregar más espacio si lo deseas)
        if (i < turnos.length - 1) {
          doc.text('', 14, doc.autoTable.previous.finalY + 10); // Deja espacio entre turnos
        }
      }
    };

    // Descargar el PDF
    doc.save('historia-clinica.pdf');
  }

  async generatePDFCanva(elementId: string, fileName: string = 'document.pdf') {
    try {
      // Obtener el elemento HTML por su ID
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`No se encontró un elemento con el ID "${elementId}".`);
      }

      // Capturar el contenido del elemento como una imagen utilizando html2canvas
      const canvas = await html2canvas(element, { scale: 2 });

      // Convertir el canvas a imagen en formato base64
      const imgData = canvas.toDataURL('image/png');

      // Crear un nuevo documento PDF con jsPDF
      const pdf = new jsPDF('p', 'mm', 'a4');

      // Calcular las dimensiones de la imagen para ajustarla al tamaño A4
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      // Agregar la imagen al PDF
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Descargar el PDF con el nombre especificado
      pdf.save(fileName);
    } catch (error) {
      console.error('Error al generar el PDF:', error);
    }
  }
}