import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { LoaderService } from '../../services/loader.service';
import { Turno } from '../../models/turno';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { PDFService } from '../../services/pdf.service';
Chart.register(...registerables)

@Component({
  selector: 'app-informe-3',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informe-3.component.html',
  styleUrl: './informe-3.component.css'
})
export class Informe3Component {
  constructor(private firestore: FirestoreService,
    public loader: LoaderService,
    private pdf: PDFService) { }
  turnosAll!: Turno[];
  private subscription: Subscription = new Subscription();
  diaCan: { dia: string; cantidad: number }[] = [];
  labelData: string[] = [];
  realData: number[] = [];
  colorData: any[] = [];



  ngOnInit(): void {
    this.loader.setLoader(true);
    this.turnosAll = [];
    const sub = this.firestore.getTurnosAll().subscribe({
      next: (turnos) => {
        if (turnos && turnos.length > 0) {

          this.turnosAll = turnos;
          this.conseguirCantidades();
          this.loader.setLoader(false);
        }
        else {
          this.loader.setLoader(false);
        }
      },
      error: (error) => {
        this.loader.setLoader(false);
        console.error(error);
      }
    });
    this.subscription.add(sub);

    this.loader.setLoader(false);
  }

  conseguirCantidades() {
    this.diaCan = this.turnosAll.reduce<{ dia: string; cantidad: number }[]>((acc, turno) => {
      const especialidadExistente = acc.find(item => item.dia === turno.dia);
      if (especialidadExistente) {
        especialidadExistente.cantidad++;
      } else {
        acc.push({ dia: turno.dia, cantidad: 1 });
      }
      return acc;
    }, []);

    if (this.diaCan !== null) {
      this.diaCan.map(o => {
        this.labelData.push(o.dia);
        this.realData.push(o.cantidad);
      })
    }
    this.cargarDatos(this.labelData, this.realData, 'piechart', 'doughnut');

  }

  cargarDatos(labelData: any, valuedata: any, chartId: string, chartType: any) {
    const mychar = new Chart(chartId, {
      type: chartType,
      data: {
        labels: labelData,
        datasets: [
          {
            label: 'Días',
            data: valuedata,
            backgroundColor: ['#c0392b', '#9b59b6', '#2980b9', '#1abc9c', '#d4ac0d', '#2e4053'],
            borderColor: ['#c0392b', '#9b59b6', '#2980b9', '#1abc9c', '#d4ac0d', '#2e4053'],
            borderWidth: 1
          }
        ]
      },
      options: {

      }
    })
  }

  descargar() {
    this.pdf.generatePDFCanva('contenido', 'turnos por dia.pdf');
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
