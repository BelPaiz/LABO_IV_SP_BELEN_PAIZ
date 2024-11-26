import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { LoaderService } from '../../services/loader.service';
import { AuthenService } from '../../services/authen.service';
import { Router } from '@angular/router';
import { DataService } from '../../services/data.service';
import { of, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-mis-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mis-pacientes.component.html',
  styleUrl: './mis-pacientes.component.css'
})
export class MisPacientesComponent {

  constructor(
    private firestore: FirestoreService,
    public loader: LoaderService,
    private auth: AuthenService,
    private router: Router,
    private data: DataService
  ) { }

  private subscription: Subscription = new Subscription();
  turnosAll: any[] = [];
  email!: string;
  paciente_nombre: string = "";
  especialista_nombre: string = "";
  turnosMap!: any[];
  mensaje: string = "";



  ngOnInit(): void {
    this.loader.setLoader(true);
    if (this.turnosAll.length === 0) {
      const subs = this.auth.DatosAutenticacion().pipe(
        switchMap(email => {
          if (email) {
            this.email = email;
            return this.firestore.getTurnosByEmailEspecialista(email);
          } else {

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

          }
        },
        error: (error) => {
          console.error(error);
          this.loader.setLoader(false);

        }
      });
      this.subscription.add(subs);
      this.loader.setLoader(false);


    } else {
      this.loader.setLoader(false);

    }

  }

  async mapearInfo() {
    // Asegurar que los arrays estén limpios
    this.turnosMap = [];

    // Crear tareas para procesar los turnos de forma paralela
    const tareas = this.turnosAll.map(async turno => {
      let user_pac = await this.buscarUsuario(turno.email_paciente);
      let user_esp = await this.buscarUsuario(turno.email_especialista);
      const mapa = {
        paciente: user_pac.nombre,
        especialista: user_esp.nombre,
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
        dato_tres: turno.dato_tres,
        foto_pac: user_pac.foto,
        email_paciente: turno.email_paciente,
        email_especialista: turno.email_especialista
      };
      return mapa;
    });

    // Ejecutar todas las tareas de forma paralela
    this.turnosMap = await Promise.all(tareas);

    this.loader.setLoader(false);
  }

  async buscarUsuario(email: string) {
    try {
      let usuario = await this.firestore.getUsuarioEmail(email);
      let nombre = this.traerNombre(usuario);
      let foto = this.traerFoto(usuario);
      let user = { nombre: nombre, foto: foto };
      return user;
    }
    catch {
      return { nombre: "", foto: "" };
    }
  }

  traerNombre(usuario: any) {
    if (usuario.nombre && usuario.apellido) {
      return `${usuario.nombre} ${usuario.apellido}`;

    }
    return "";
  }
  traerFoto(usuario: any) {
    if (usuario.img1) {
      return usuario.img1;
    }
    return "";
  }

  verDetalle(paciente: string) {
    this.data.setEmail(paciente);
    this.router.navigate(['/historia-clinica']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
