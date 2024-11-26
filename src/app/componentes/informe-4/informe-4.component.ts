import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { LoaderService } from '../../services/loader.service';
import { Turno } from '../../models/turno';
import { Subscription } from 'rxjs';
import { Chart, registerables } from 'chart.js';
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { PDFService } from '../../services/pdf.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
Chart.register(...registerables)

@Component({
  selector: 'app-informe-4',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './informe-4.component.html',
  styleUrl: './informe-4.component.css',
  animations: [
    trigger('myAnimation', [
      state('open', style({
        height: '65%',
        opacity: 1,
      })),
      state('closed', style({
        height: '80px',
        opacity: 0.8,
        backgroundColor: '#85c1e9'
      })),
      transition('closed => open', [animate('1s')]),
    ]),
  ]
})
export class Informe4Component {
  constructor(private firestore: FirestoreService,
    public loader: LoaderService,
    private data: DataService,
    private router: Router,
    private pdf: PDFService) { }


  turnosAll!: Turno[];
  private subscription: Subscription = new Subscription();
  diaCan: { especialista: string; cantidad: number }[] = [];
  labelData: string[] = [];
  realData: number[] = [];
  colorData: any[] = [];
  fecha_desde!: string;
  fecha_hasta!: string;
  turnosFiltrados!: any[];
  mensaje: string = "";
  turnosMap!: any[];
  chart: Chart | null = null;
  canvaCreado: boolean = false;
  estadoSolicitado!: string;

  enterLeave = signal(true);
  isOpen = signal(false);



  ngOnInit(): void {
    this.loader.setLoader(true);
    this.turnosAll = [];
    this.turnosMap = [];
    this.turnosFiltrados = [];
    this.estadoSolicitado = this.data.getEstado();
    if (this.estadoSolicitado === '') {
      this.router.navigate(['/informes']);
    } else {
      if (this.estadoSolicitado === 'todos') {
        this.estadoSolicitado = 'solicitado';
      }
    }
    const sub = this.firestore.getTurnosAll().subscribe({
      next: (turnos) => {
        if (turnos && turnos.length > 0) {

          this.turnosAll = turnos;

          this.mapearInfo();

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

  async mapearInfo() {
    // Asegurar que los arrays estén limpios
    this.turnosMap = [];
    this.turnosFiltrados = [];

    // Crear tareas para procesar los turnos de forma paralela
    const tareas = this.turnosAll.map(async turno => {
      const mapa = {
        especialista: await this.buscarUsuario(turno.email_especialista),
        dia: turno.dia,
        fecha: turno.fecha,
        estado: turno.estado,
      };
      return mapa;
    });

    // Ejecutar todas las tareas de forma paralela
    this.turnosMap = await Promise.all(tareas);

    // Desactivar el loader
    this.loader.setLoader(false);
  }

  async buscarUsuario(email: string) {
    try {
      let usuario = await this.firestore.getUsuarioEmail(email);
      let nombre = this.traerNombre(usuario);
      return nombre;
    }
    catch {
      return "";
    }
  }

  traerNombre(usuario: any) {
    if (usuario.nombre && usuario.apellido) {
      return `${usuario.nombre} ${usuario.apellido}`;

    }
    return "";
  }


  filtrarTurnos() {

    if (!this.fecha_desde || !this.fecha_hasta) {
      this.mensaje = 'Por favor, selecciona un rango de fechas válido';
      return;
    }

    // Convertir las fechas ingresadas al formato Date
    const desde = new Date(this.fecha_desde);
    const hasta = new Date(this.fecha_hasta);

    if (desde > hasta) {
      this.mensaje = 'La fecha "Desde" no puede ser mayor que la fecha "Hasta"';
      return;
    }

    if (this.estadoSolicitado === 'finalizado') {
      // Filtrar el array de turnosAll
      this.turnosFiltrados = this.turnosMap.filter(turno => {
        const fechaTurno = this.convertirFecha(turno.fecha); // Convertir la fecha del turno a Date
        return (
          fechaTurno >= desde &&
          fechaTurno <= hasta &&
          turno.estado === 'finalizado' // Filtro por estado
        );
      });
    } else {
      // Filtrar el array de turnosAll
      this.turnosFiltrados = this.turnosMap.filter(turno => {
        const fechaTurno = this.convertirFecha(turno.fecha); // Convertir la fecha del turno a Date
        return fechaTurno >= desde && fechaTurno <= hasta; // Comparar rango
      });
    }

    this.conseguirCantidades();
    this.isOpen.set(!this.isOpen());
  }

  // Función para convertir fechas de formato DD/MM/YYYY a Date
  convertirFecha(fechaString: string): Date {
    const [day, month, year] = fechaString.split('/').map(Number);
    return new Date(year, month - 1, day); // Los meses en JavaScript son base 0
  }


  conseguirCantidades() {
    this.diaCan = this.turnosFiltrados.reduce<{ especialista: string; cantidad: number }[]>((acc, turno) => {
      const especialidadExistente = acc.find(item => item.especialista === turno.especialista);
      if (especialidadExistente) {
        especialidadExistente.cantidad++;
      } else {
        acc.push({ especialista: turno.especialista, cantidad: 1 });
      }
      return acc;
    }, []);

    if (this.diaCan !== null) {
      this.diaCan.map(o => {
        this.labelData.push(o.especialista);
        this.realData.push(o.cantidad);
      })
    }
    this.cargarDatos(this.labelData, this.realData, 'piechart', 'polarArea');

  }

  cargarDatos(labelData: any, valuedata: any, chartId: string, chartType: any) {
    if (!this.canvaCreado) {
      const mychar = new Chart(chartId, {
        type: chartType,
        data: {
          labels: labelData,
          datasets: [
            {
              label: 'Turnos',
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
      this.canvaCreado = true;
    } else {

      this.router.navigate(['/informes']);
    }

  }

  limpiarMensaje() {
    this.mensaje = "";

  }

  descargar() {

    if (this.diaCan.length === 0) {
      this.mensaje = 'Seleccione fechas';
      return;
    }
    this.pdf.generatePDFCanva('contenido', 'informe de turnos.pdf');
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
