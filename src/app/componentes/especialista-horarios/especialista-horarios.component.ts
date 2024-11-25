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

  constructor(
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

  dias: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

  horarioSemanal = horarioSemanal;

  horarioSabado = horarioSabado;
  error: string = "";
  turnosSeleccionados: string[] = [];
  selectInicio!: HTMLSelectElement;
  selectFin!: HTMLSelectElement;
  especialidadSeleccionada: string[] = [];
  seleccionEspecial: string = "";

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
    this.turnosSeleccionados = [];
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

  seleccionEspecialidad(espec: string) {
    this.seleccionEspecial = espec;
    if (this.especialidadSeleccionada.length > 0) {
      this.especialidadSeleccionada = [];
    }
    this.especialidadSeleccionada.push(espec);
  }

  // , fecha: string

  async guardarDisponibilidad(dia: string) {
    if (this.validarHorarios()) {
      if (this.especialidadSeleccionada.length > 0) {
        if (this.email !== null && this.especialidades) {
          if (this.horaFin > this.horaDesde) {

            for (let i = 0; i < this.fechas.length; i++) {
              if (this.fechas[i].dia === dia) {
                this.calcularDisponible();

                this.disponibilidad = {
                  email: this.email,
                  dia: dia,
                  fecha: this.fechas[i].fecha,
                  especialidad: this.especialidadSeleccionada,
                  disponible: this.turnosSeleccionados
                }

                const disponibilidadDoc = await this.firestore.getDisponibilidadId(this.disponibilidad);
                if (disponibilidadDoc !== null) {
                  let data = {
                    disponible: this.turnosSeleccionados,
                    especialidad: this.especialidadSeleccionada
                  }
                  await this.firestore.updateDisponibilidad(disponibilidadDoc.id, data);
                  this.mostrarError("Disponibilidad actualizada exitosamente");
                } else {
                  this.firestore.setDisponibilidad(this.disponibilidad);
                  this.mostrarError("Disponibilidad guardada exitosamente");
                }
              }
            }
            this.turnosSeleccionados = [];
            this.horaFin = "";
            this.horaDesde = "";
          }
        }
      } else {
        this.mostrarError("Seleccione especialidad");
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
