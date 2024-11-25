import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenService } from '../../services/authen.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-paciente-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paciente-perfil.component.html',
  styleUrl: './paciente-perfil.component.css'
})
export class PacientePerfilComponent {
  constructor(private auth: AuthenService,
    private firestore: FirestoreService,
    public loader: LoaderService,
    private router: Router,
    private data: DataService
  ) { }

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

  ngOnInit(): void {
    this.loader.setLoader(true);
    const sub = this.auth.DatosAutenticacion().subscribe({
      next: (email) => {
        if (email) {
          this.email = email;
          this.traerUsuario(this.email);
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

  traerUsuario(email: string) {
    const sub = this.firestore.getUsuarioPorEmail(email)
      .subscribe({
        next: (user) => {
          if (user && user.length > 0) {
            this.usuario = user[0];
            // this.enviarEmail();
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
    this.subscription.add(sub);
  }

  verDetalle(paciente: string) {
    this.data.setEmail(paciente);
    this.router.navigate(['/historia-clinica']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}

