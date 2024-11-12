import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { AuthenService } from '../../services/authen.service';
import { Usuario } from '../../models/usuario';
import { Subscription } from 'rxjs';
import { Disponibilidad } from '../../models/disponibilidad_horaria';
import { FormsModule, SelectControlValueAccessor } from '@angular/forms';
import { horarioSabado, horarioSemanal } from '../../enumerados/turnos';

@Component({
  selector: 'app-especialista-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialista-horarios.component.html',
  styleUrl: './especialista-horarios.component.css'
})
export class EspecialistaHorariosComponent {

  constructor(private auth: AuthenService,
    private firestore: FirestoreService
  ) { }

  @Input() especialidades: string[] | null = null;
  @Input() email: string | null = null;

  usuario!: Usuario;
  // email: string = "";
  private subscription: Subscription = new Subscription();
  disponibilidad!: Disponibilidad;
  cantidad_turnos: number = 0;
  horaDesde: number = 0;
  horaFin: number = 0;

  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];

  horarioSemanal = horarioSemanal;

  horarioSabado = horarioSabado;
  error: string = "";
  turnosSeleccionados: number[] = [];

  recuperarHorario(event: Event, caso: string) {
    const select = event.target as HTMLSelectElement;
    let turnoSelec = parseInt(select.value);
    console.log(turnoSelec);
    if (turnoSelec !== 0) {
      if (caso === 'inicio') {
        this.horaDesde = turnoSelec;
      }
      else {
        if (this.horaDesde < turnoSelec) {
          this.horaFin = turnoSelec;
        } else {
          this.error = "La hora de finalizacion debe ser mayor a la hora de inicio";
        }
      }
    }
    else {
      this.error = "Verifique haber seleccionado correctamente";
    }
  }

  calcularDisponible() {
    if (this.horaDesde !== null && this.horaFin !== null) {
      const minHora = Math.min(this.horaDesde, this.horaFin);
      const maxHora = Math.max(this.horaDesde, this.horaFin);

      // Filtra las claves de horarioSemanal dentro del rango
      this.turnosSeleccionados = Object.keys(this.horarioSemanal)
        .map(Number) // Convertimos las claves a números
        .filter(key => key >= minHora && key <= maxHora); // Filtramos dentro del rango
    }
  }


  async guardarDisponibilidad(dia: string) {
    if (this.email !== null && this.especialidades
      && this.horaDesde && this.horaFin) {
      this.calcularDisponible();
      this.disponibilidad = {
        email: this.email,
        dia: dia,
        especialidad: this.especialidades,
        disponible: this.turnosSeleccionados
      }
      const disponibilidadDoc = await this.firestore.getDisponibilidadId(this.disponibilidad);
      if (disponibilidadDoc !== null) {
        let data = {
          disponible: this.turnosSeleccionados
        }
        await this.firestore.updateDisponibilidad(disponibilidadDoc.id, data);
      } else {
        this.firestore.setDisponibilidad(this.disponibilidad);
      }
    }
  }

}
