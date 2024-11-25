import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { of, Subscription, switchMap } from 'rxjs';
import { Turno } from '../../models/turno';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import { FormsModule } from '@angular/forms';
import { AuthenService } from '../../services/authen.service';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-ver-turnos-especialista',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ver-turnos-especialista.component.html',
  styleUrl: './ver-turnos-especialista.component.css'
})
export class VerTurnosEspecialistaComponent {
  constructor(
    private firestore: FirestoreService,
    public loader: LoaderService,
    private auth: AuthenService,
    private router: Router,
    private data: DataService
  ) { }

  private subscription: Subscription = new Subscription();
  turnosAll: any[] = [];
  paciente: any;
  especialista: any;
  paciente_nombre: string = "";
  especialista_nombre: string = "";
  turnosMap!: any[];
  turnosFiltrados!: any[];
  comentario: string = "";
  mensaje: string = "";
  email!: string;



  ngOnInit(): void {
    this.mensaje = "";
    this.loader.setLoader(true);
    if (this.turnosAll.length === 0) {
      const subs = this.auth.DatosAutenticacion().pipe(
        switchMap(email => {
          if (email) {
            this.email = email;
            return this.firestore.getTurnosByEmailEspecialista(email);
          } else {
            this.loader.setLoader(false);
            this.mensaje = "Ocurrio un error al obtener sus turnos";
            return of(null);
          }
        })
      ).subscribe({
        next: (turnos) => {
          if (turnos && turnos.length > 0) {
            this.turnosAll = [];
            this.turnosAll = turnos;

            this.mapearInfo();
          }
          else {
            this.loader.setLoader(false);
            this.mensaje = "No hay turnos para mostrar";
          }
        },
        error: (error) => {
          this.loader.setLoader(false);
          console.error(error);
        }
      });
      this.subscription.add(subs);
    } else {
      this.loader.setLoader(false);
    }

  }

  async mapearInfo() {
    // Asegurar que los arrays estén limpios
    this.turnosMap = [];
    this.turnosFiltrados = [];

    // Crear tareas para procesar los turnos de forma paralela
    const tareas = this.turnosAll.map(async turno => {
      const mapa = {
        paciente: await this.buscarUsuario(turno.email_paciente),
        especialista: await this.buscarUsuario(turno.email_especialista),
        especialidad: turno.especialidad,
        dia: turno.dia,
        fecha: turno.fecha,
        hora: turno.hora,
        estado: turno.estado,
        comentario: turno.comentario,
        encuesta: turno.encuesta,
        calificacion: turno.calificacion,
        historia: turno.historia,
        id: turno.id,
        altura: turno.altura,
        peso: turno.peso,
        temperatura: turno.temperatura,
        presion: turno.presion,
        dato_uno: turno.dato_uno,
        dato_dos: turno.dato_dos,
        dato_tres: turno.dato_tres
      };
      return mapa;
    });

    // Ejecutar todas las tareas de forma paralela
    this.turnosMap = await Promise.all(tareas);

    // Actualizar turnosFiltrados
    this.turnosFiltrados = [...this.turnosMap];

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

  ingresoCaracter(event: Event): void {
    const input = event.target as HTMLInputElement; // Casting del target a HTMLInputElement
    this.filtrarTurnos(input.value);               // Usar el valor del input
  }

  filtrarTurnos(valor: string): void {
    const texto = valor.toLowerCase();

    this.turnosFiltrados = this.turnosMap.filter(turno =>
      Object.values(turno).some(val =>
        val != null && val.toString().toLowerCase().includes(texto)
      )
    );
  }

  guardar_estado(texto: string, id: string, estado: string) {
    if ((texto && texto !== '') || ((!texto || texto === '') && estado === 'aceptado')) {
      const data = {
        comentario: texto,
        estado: estado
      };
      this.firestore.updateTurnoComentarioEstado(id, data)
        .then(() => {
          this.mensaje = "Estado del turno actualizado";
          setTimeout(() => {
            this.mensaje = "";
            this.comentario = "";
          }, 2500);
          if (estado === 'finalizado') {
            this.irHc(id);
          }
        })
        .catch(error => {
          console.error(error);
        });
    } else {
      this.mensaje = "Debe ingresar un comentario.";
      setTimeout(() => {
        this.mensaje = "";
        this.comentario = "";
      }, 2500);
    }

  }
  irHc(id: string) {
    this.data.setTurno(id);
    this.router.navigate(['/completar-hc']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
