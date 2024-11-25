import { Component, Input, SimpleChanges } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ExcelService } from '../../services/excel.service';
import { MayusculasNombreDirective } from '../../directivas/mayusculas-nombre.directive';


@Component({
  selector: 'app-listado-pacientes',
  standalone: true,
  imports: [CommonModule, MayusculasNombreDirective],
  templateUrl: './listado-pacientes.component.html',
  styleUrl: './listado-pacientes.component.css'
})
export class ListadoPacientesComponent {


  constructor(private firestore: FirestoreService,
    private router: Router,
    private data: DataService,
    private excel: ExcelService
  ) { }
  @Input() usuarios!: Usuario[];

  private subscription: Subscription = new Subscription();
  turnosAll: any[] = [];
  turnosMap!: any[];
  mensaje: string = "";
  isExporting: boolean = false;

  seleccionExcel(email: string) {
    const subs = this.firestore.getTurnosByEmail(email)
      .subscribe({
        next: (turnos) => {
          if (turnos && turnos.length > 0) {
            this.turnosAll = [];
            this.turnosAll = turnos;
            this.mapearInfo(email);
          }
          else {
            this.mensaje = "El paciente seleccionado no solicito turnos aún."
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
    this.subscription.add(subs);
  }

  limpiarMensaje() {
    this.mensaje = "";
  }


  async mapearInfo(email: string) {
    try {
      // Evitar exportaciones múltiples
      if (this.isExporting) {
        console.warn('Exportación en curso. Evitando llamada duplicada.');
        return;
      }
      this.isExporting = true;

      this.turnosMap = [];

      const tareas = this.turnosAll.map(async turno => {
        const mapa = {
          especialista: await this.buscarUsuario(turno.email_especialista),
          especialidad: turno.especialidad,
          fecha: turno.fecha,
          hora: turno.hora,
          estado: turno.estado,
          comentario: turno.comentario,
        };
        return mapa;
      });

      this.turnosMap = await Promise.all(tareas);

      if (this.turnosMap.length > 0) {
        this.excel.exportarCSV(this.turnosMap, `Turnos ${email}`, ['fecha', 'hora', 'especialista', 'especialidad', 'estado', 'comentario']);
      }
    } catch (error) {
      console.error('Error en mapearInfo:', error);
    } finally {
      this.isExporting = false; // Restablecer la bandera
    }
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





  seleccionHC(email: string) {
    this.data.setEmail(email);
    this.router.navigate(['/historia-clinica']);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
