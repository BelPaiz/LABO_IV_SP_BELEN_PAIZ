import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenService } from '../../services/authen.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { EspecialistaHorariosComponent } from "../especialista-horarios/especialista-horarios.component";
import { Disponibilidad } from '../../models/disponibilidad_horaria';
import { OrdenarFechasPipe } from '../../pipes/ordenar-fechas.pipe';

@Component({
  selector: 'app-especialista-perfil',
  standalone: true,
  imports: [CommonModule, EspecialistaHorariosComponent, OrdenarFechasPipe],
  templateUrl: './especialista-perfil.component.html',
  styleUrl: './especialista-perfil.component.css'
})
export class EspecialistaPerfilComponent implements OnInit {

  constructor(private auth: AuthenService,
    private firestore: FirestoreService,
    private router: Router
  ) { }

  @Output() especialidades = new EventEmitter<string[]>();
  @Output() email_ = new EventEmitter<string>();

  usuario: Usuario = {
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
  email: string = "";
  private subscription: Subscription = new Subscription();

  disponibilidad!: Disponibilidad[];

  disp: any[] = [];

  texto: string = "Disponibilidad horaria guardada:";
  texto_lunes: string = "Lunes: ";
  texto_martes: string = "Martes: ";
  texto_miercoles: string = "Miercoles: ";
  texto_jueves: string = "Jueves: ";
  texto_viernes: string = "Viernes: ";
  texto_sabado: string = "Sábado:";




  ngOnInit(): void {
    this.auth.DatosAutenticacion().subscribe({
      next: (email) => {
        if (email) {
          this.email = email;
          this.traerUsuario(this.email);

          this.traerDisponibilidad(this.email);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  traerUsuario(email: string) {
    const sub = this.firestore.getUsuarioPorEmail(email)
      .subscribe({
        next: (user) => {
          if (user && user.length > 0) {
            this.usuario = user[0];
            this.enviarEspecialidades();
            this.enviarEmail();
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
    this.subscription.add(sub);
  }

  traerDisponibilidad(email: string) {

    const sub = this.firestore.getDisponibilidadPorMail(email)
      .subscribe({
        next: (disponible) => {
          if (disponible && disponible.length > 0) {
            this.disponibilidad = [];
            this.disp = [];
            this.disponibilidad = disponible;
            for (let index = 0; index < disponible.length; index++) {
              let ultimo = disponible[index].disponible.length;

              let newDisp = {
                dia: disponible[index].dia,
                fecha: disponible[index].fecha,
                desde: disponible[index].disponible[0],
                hasta: disponible[index].disponible[ultimo - 1]
              }

              this.disp.push(newDisp);
            }
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
    this.subscription.add(sub);
  }

  enviarEspecialidades() {
    if (this.usuario && this.usuario.especialidad) {
      this.especialidades.emit(this.usuario.especialidad);
    }
  }
  enviarEmail() {
    if (this.usuario && this.usuario.email) {
      this.email_.emit(this.usuario.email);
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
