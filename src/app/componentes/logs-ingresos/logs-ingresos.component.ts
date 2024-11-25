import { Component } from '@angular/core';
import { DataService } from '../../services/data.service';
import { LoaderService } from '../../services/loader.service';
import { FirestoreService } from '../../services/firestore.service';
import { Subscription } from 'rxjs';
import { Usuario } from '../../models/usuario';
import { CommonModule } from '@angular/common';
import { ExcelService } from '../../services/excel.service';

@Component({
  selector: 'app-logs-ingresos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logs-ingresos.component.html',
  styleUrl: './logs-ingresos.component.css'
})
export class LogsIngresosComponent {
  constructor(private firestore: FirestoreService,
    public loader: LoaderService,
    private excel: ExcelService) { }

  ngOnInit(): void {
    this.loader.setLoader(true);
    this.generarTabla();


  }

  usuarios!: Usuario[];
  private subscription: Subscription = new Subscription();
  logs!: any[];
  logsMap!: any[];
  mensaje: string = "";

  generarTabla() {
    const subs = this.firestore.getUsuariosAll()
      .subscribe((respuesta) => {
        this.usuarios = respuesta;
        this.loader.setLoader(false);
      });
    this.subscription.add(subs);
  }

  seleccionarUsuario(email: string) {
    this.limpiarMensaje();
    this.traerLogs(email);
  }

  traerLogs(email: string) {
    const sub = this.firestore.getSesionesPorEmail(email)
      .subscribe((respuesta) => {

        this.logs = respuesta;
        if (this.logs.length > 0) {
          this.formatoArray();
        }
        else {
          this.mensaje = "No hay ingresos registrados para este usuario."
          this.logsMap = [];
        }

      });
    this.subscription.add(sub);
  }

  limpiarMensaje() {
    this.mensaje = "";
  }

  descargarExcel() {
    if (this.logsMap.length > 0) {
      this.excel.exportarCSV(this.logsMap, `Ingresos ${this.logsMap[0].usuario}`, ['usuario', 'fecha', 'hora']);
    }
  }

  formatoArray() {
    this.logsMap = this.logs.map(sesion => {
      const date = new Date(sesion.fecha.seconds * 1000); // Convertir a Date
      return {
        usuario: sesion.usuario,
        fecha: this.formatDate(date),
        hora: this.formatTime(date),
      };
    });
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options); // Ejemplo: "15 de noviembre de 2024"
  }

  formatTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true };
    return date.toLocaleTimeString('es-ES', options); // Ejemplo: "7:00 p. m."
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
