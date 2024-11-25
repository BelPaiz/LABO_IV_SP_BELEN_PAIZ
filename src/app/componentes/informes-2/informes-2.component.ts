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
  selector: 'app-informes-2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './informes-2.component.html',
  styleUrl: './informes-2.component.css'
})
export class Informes2Component implements OnInit {

  constructor(private firestore: FirestoreService,
    public loader: LoaderService,
    private pdf: PDFService) { }


  turnosAll!: Turno[];
  private subscription: Subscription = new Subscription();
  espeCan: { especialidad: string; cantidad: number }[] = [];
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
          // console.log(this.espeCan);
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
    this.espeCan = this.turnosAll.reduce<{ especialidad: string; cantidad: number }[]>((acc, turno) => {
      const especialidadExistente = acc.find(item => item.especialidad === turno.especialidad);
      if (especialidadExistente) {
        especialidadExistente.cantidad++;
      } else {
        acc.push({ especialidad: turno.especialidad, cantidad: 1 });
      }
      return acc;
    }, []);

    if (this.espeCan !== null) {
      this.espeCan.map(o => {
        this.labelData.push(o.especialidad);
        this.realData.push(o.cantidad);
      })
    }
    this.cargarDatos(this.labelData, this.realData);

  }

  cargarDatos(labelData: any, valuedata: any) {
    const mychar = new Chart('barchart', {
      type: 'bar',
      data: {
        labels: labelData,
        datasets: [
          {
            label: 'Especialidad',
            data: valuedata,
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            borderWidth: 1
          }
        ]
      },
      options: {

      }
    })
  }

  descargar() {
    this.pdf.generatePDFCanva('contenido', 'turnos por especialidad.pdf');
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
