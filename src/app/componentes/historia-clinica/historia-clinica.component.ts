import { CommonModule, registerLocaleData } from '@angular/common';
import { Component, LOCALE_ID, OnInit } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { PDFService } from '../../services/pdf.service';
import { FirestoreService } from '../../services/firestore.service';
import { Usuario } from '../../models/usuario';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data.service';
import { Turno } from '../../models/turno';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';

registerLocaleData(localeEs, 'es');

@Component({
  selector: 'app-historia-clinica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historia-clinica.component.html',
  styleUrl: './historia-clinica.component.css',
  providers: [{ provide: LOCALE_ID, useValue: 'es' }]
})
export class HistoriaClinicaComponent implements OnInit {

  constructor(private pdf: PDFService,
    private firestore: FirestoreService,
    private data: DataService,
    private loader: LoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loader.setLoader(true);
    this.email = this.data.getEmail();

    if (this.email) {
      this.traerUsuario();
      this.traerTurnos();
    }
    else {
      this.loader.setLoader(false);
      this.router.navigate(['/mis-pacientes']);
    }

  }



  today: Date = new Date();
  email!: string;
  nombre_paciente!: string;
  nombre_especialista!: string;


  private subscription: Subscription = new Subscription();




  paciente: Usuario = {
    nombre: "",
    apellido: "",
    edad: "",
    dni: "",
    obra_social: null,
    especialidad: null,
    email: "",
    img1: "",
    img2: null,
    tipo: "",
    habilitado: false
  };

  turnos!: Turno[];
  turnosMap!: any[];

  descargarPdf(): void {
    this.pdf.generarPdf(this.paciente, this.turnosMap, this.today, this.nombre_paciente);
  }

  traerUsuario() {
    const sub = this.firestore.getUsuarioPorEmail(this.data.getEmail())
      .subscribe({
        next: (user) => {
          if (user && user.length > 0) {
            this.paciente = user[0];
            this.nombre_paciente = this.traerNombre(this.paciente);
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
    this.subscription.add(sub);
  }

  traerTurnos() {
    const sub = this.firestore.getTurnosByEmail(this.data.getEmail())
      .subscribe({
        next: (turnos) => {
          if (turnos && turnos.length > 0) {
            // Filtrar los turnos que estén en estado "finalizado"
            this.turnos = turnos.filter(turno => turno.estado === 'finalizado');
            this.mapearInfo();
            this.loader.setLoader(false);
          } else {
            this.turnos = []; // Asegurarse de que el array esté vacío si no hay turnos finalizados
            this.loader.setLoader(false);
          }
        },
        error: (error) => {
          console.error(error);
          this.loader.setLoader(false);
        }
      });
    this.subscription.add(sub);
  }

  async mapearInfo() {
    // Asegurar que los arrays estén limpios
    this.turnosMap = [];

    // Crear tareas para procesar los turnos de forma paralela
    const tareas = this.turnos.map(async turno => {
      const mapa = {
        paciente: this.nombre_paciente,
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
      let nombre = `${usuario.nombre} ${usuario.apellido}`
      return nombre;
    }

    return "";
  }



  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
