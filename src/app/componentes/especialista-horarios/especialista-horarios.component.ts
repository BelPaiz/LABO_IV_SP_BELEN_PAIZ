import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { AuthenService } from '../../services/authen.service';
import { Usuario } from '../../models/usuario';
import { Subscription } from 'rxjs';
import { Disponibilidad } from '../../models/disponibilidad_horaria';
import { FormsModule, SelectControlValueAccessor } from '@angular/forms';
import { horarioSabado, horarioSemanal } from '../../enumerados/turnos_disponible';
import { FechasService } from '../../services/fechas.service';

@Component({
  selector: 'app-especialista-horarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './especialista-horarios.component.html',
  styleUrl: './especialista-horarios.component.css'
})
export class EspecialistaHorariosComponent implements OnInit {

  constructor(private auth: AuthenService,
    private firestore: FirestoreService,
    private fecha_serv: FechasService
  ) { }
  ngOnInit(): void {
    this.traerFechas();
  }

  @Input() especialidades: string[] | null = null;
  @Input() email: string | null = null;

  usuario!: Usuario;
  // email: string = "";
  private subscription: Subscription = new Subscription();
  disponibilidad!: Disponibilidad;
  cantidad_turnos: number = 0;
  horaDesde: string = "";
  horaFin: string = "";

  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  horarioSemanal = horarioSemanal;

  horarioSabado = horarioSabado;
  error: string = "";
  turnosSeleccionados: string[] = [];
  selectInicio!: HTMLSelectElement;
  selectFin!: HTMLSelectElement;

  fechas = [
    {
      dia: "",
      fecha: ""
    }
  ];

  fecha_obj: any[] = [];



  recuperarHorarioInicio(event: Event) {
    this.selectInicio = event.target as HTMLSelectElement;
    this.horaDesde = this.selectInicio.value;
  }

  recuperarHorarioFin(event: Event) {
    this.selectFin = event.target as HTMLSelectElement;
    this.horaFin = this.selectFin.value;
  }

  validarHorarios() {
    if (this.horaDesde === "" || this.horaFin === "") {
      this.mostrarError("Vuelva a seleccionar el horario");
      this.selectFin.value = "";
      this.selectInicio.value = "";
      this.horaFin = "";
      this.horaDesde = "";
      return false;
    } else {
      if (this.horaFin > this.horaDesde) {
        return true;
      } else {
        this.mostrarError("La hora de finalizacion debe ser mayor a la hora de inicio");
        this.selectFin.value = "";
        this.selectInicio.value = "";
        this.horaFin = "";
        this.horaDesde = "";
        return false;
      }
    }
  }
  calcularDisponible() {
    for (let i = 0; i <= horarioSemanal.length; i++) {
      if (horarioSemanal[i] >= this.horaDesde && horarioSemanal[i] <= this.horaFin) {
        this.turnosSeleccionados.push(horarioSemanal[i]);
      }
    }
  }

  traerFechas() {
    this.fechas = [];
    const hoy = new Date();
    this.fecha_obj = this.fecha_serv.traerProximos(hoy);

    for (let i = 0; i < this.fecha_obj.length; i++) {
      if (this.dias.includes(this.fecha_obj[i].dia)) {
        this.fechas.push(this.fecha_obj[i]);
      }
    }
  }


  async guardarDisponibilidad(dia: string, fecha: string) {
    if (this.validarHorarios()) {
      if (this.email !== null && this.especialidades) {
        if (this.horaFin > this.horaDesde) {
          this.calcularDisponible();
          this.disponibilidad = {
            email: this.email,
            dia: dia,
            fecha: fecha,
            especialidad: this.especialidades,
            disponible: this.turnosSeleccionados
          }
          const disponibilidadDoc = await this.firestore.getDisponibilidadId(this.disponibilidad);
          if (disponibilidadDoc !== null) {
            let data = {
              disponible: this.turnosSeleccionados
            }
            await this.firestore.updateDisponibilidad(disponibilidadDoc.id, data);
            this.mostrarError("Disponibilidad actualizada exitosamente");
          } else {
            this.firestore.setDisponibilidad(this.disponibilidad);
            this.mostrarError("Disponibilidad guardada exitosamente");
          }
          this.turnosSeleccionados = [];
          this.horaFin = "";
          this.horaDesde = "";
        }
      }
    }
  }

  mostrarError(error: string) {
    this.error = error;
    setTimeout(() => {
      this.error = "";
    }, 2000);
  }

}
