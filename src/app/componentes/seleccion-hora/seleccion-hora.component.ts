import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Disponibilidad } from '../../models/disponibilidad_horaria';
import { CommonModule } from '@angular/common';
import { FormatoHoraPipe } from '../../pipes/formato-hora.pipe';
import { of, Subscription, switchMap } from 'rxjs';
import { AuthenService } from '../../services/authen.service';
import { Turno } from '../../models/turno';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-seleccion-hora',
  standalone: true,
  imports: [CommonModule, FormatoHoraPipe, FormsModule],
  templateUrl: './seleccion-hora.component.html',
  styleUrl: './seleccion-hora.component.css'
})
export class SeleccionHoraComponent implements OnChanges, OnInit, OnDestroy {

  constructor(private firestore: FirestoreService,
    private auth: AuthenService,
    private router: Router,
    private data: DataService
  ) { }

  @Input() disponibles!: Disponibilidad;
  @Input() especialista_elegido: string | null = null;
  @Input() especialidad_elegida: string | null = null;
  @Input() fecha_elegida: string | null = null;


  private subscription: Subscription = new Subscription();
  email: string = "";

  disponibilidad: Disponibilidad = {
    email: "",
    especialidad: [],
    dia: "",
    fecha: "",
    disponible: []
  };
  nuevoTurno!: Turno;

  turnosOcupados: Turno[] = [];

  mensaje: string[] = ["", ""];
  ocultar: boolean = false;
  mostrar: boolean = false;
  fecha: any;
  user: any;
  tipoUsuario!: string;
  email_turno!: string;

  ngOnInit(): void {
    this.ocultar = false;
    this.mostrar = false;

    const subs = this.auth.DatosAutenticacion().pipe(
      switchMap(email => {
        if (email) {
          this.email = email;
          return this.firestore.getUsuarioPorEmail(email);
        } else {
          return of(null);
        }
      })
    ).subscribe({
      next: (users) => {
        if (users && users.length > 0) {
          this.user = users[0];
          this.tipoUsuario = this.user['tipo'];
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.subscription.add(subs);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['fecha_elegida'] && changes['fecha_elegida'].currentValue) {
      this.fecha = this.fecha_elegida;
      this.turnosOcupados = [];
      this.disponibilidad = {
        email: "",
        especialidad: [],
        dia: "",
        fecha: "",
        disponible: []
      };
      this.disponibilidad = this.disponibles; //cargo el array de disponibilidad
      console.log(this.disponibles);
      this.traerTurnosOcupados(); //me traigo los turnos ocupados que coincidan con la fecha y el especialista elegidos
    }
    if (changes['especialista_elegido'] && changes['especialista_elegido'].currentValue) {
      this.disponibilidad = {
        email: "",
        especialidad: [],
        dia: "",
        fecha: "",
        disponible: []
      }
      this.turnosOcupados = [];
    }
  }
  seleccionTurno(hora: string) {
    this.ocultar = true;
    this.mostrar = true;

    if (this.especialidad_elegida !== null && this.fecha_elegida) {
      if (this.tipoUsuario === 'admin') {
        this.email_turno = this.data.getEmail();
      }
      else {
        this.email_turno = this.email;
      }

      this.nuevoTurno = {
        email_paciente: this.email_turno,
        email_especialista: this.disponibilidad.email,
        especialidad: this.especialidad_elegida,
        dia: this.disponibilidad.dia,
        fecha: this.fecha_elegida,
        hora: hora,
        estado: 'pendiente',
        comentario: null,
        encuesta: null,
        calificacion: null,
        historia: false,
        altura: null,
        peso: null,
        temperatura: null,
        presion: null,
        dato_uno: null,
        dato_dos: null,
        dato_tres: null
      }
      this.firestore.nuevoTurno(this.nuevoTurno)
        .then((respuesta) => {
          if (respuesta.id) {
            this.mensaje[0] = 'Turno reservado correctamente, el mismo se encuentra en estado pendiente de aceptación,';
            this.mensaje[1] = `para la especialidad ${this.nuevoTurno.especialidad}, el día ${this.nuevoTurno.dia} ${this.nuevoTurno.fecha}/2024 a las ${this.nuevoTurno.hora}hs`;
            setTimeout(() => {
              if (this.tipoUsuario === 'admin') {
                this.router.navigate(['/ver-turnos-admin']);
              } else {
                this.router.navigate(['/ver-turnos-paciente']);
              }
            }, 3000);
          }
        })
        .catch((error) => {
          this.mensaje[0] = 'Ocurrio un error con la reservación, turno no reservado, reintente nuevamente mas tarde';
        })

    }
  }
  traerTurnosOcupados() {
    const sub = this.firestore.getTurnoPorDato('email_especialista', this.disponibilidad.email).subscribe({
      next: (turnos) => {
        if (turnos && turnos.length > 0) {
          this.turnosOcupados = turnos;
          const turnosFiltrados = this.turnosOcupados.filter(turno => turno.fecha === this.fecha_elegida);
          this.turnosOcupados = turnosFiltrados;
          console.log(this.turnosOcupados);
          this.excluirOcupados(); //excluyo del array de disponibilidad.disponible los turnos que ya esten ocupados
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.subscription.add(sub);
  }
  excluirOcupados() {
    const turnosValidos = this.turnosOcupados.filter(
      turno => turno.estado !== 'cancelado' && turno.estado !== 'rechazado'
    );
    // Excluir los horarios ocupados de la disponibilidad
    const disponibleFiltrado = this.disponibilidad.disponible.filter(
      hora => !turnosValidos.some(turno => turno.hora === hora)
    );
    this.disponibilidad.disponible = disponibleFiltrado;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
