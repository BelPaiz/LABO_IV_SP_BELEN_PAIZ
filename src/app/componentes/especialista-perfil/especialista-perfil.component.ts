import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthenService } from '../../services/authen.service';
import { Router } from '@angular/router';
import { Usuario } from '../../models/usuario';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';
import { EspecialistaHorariosComponent } from "../especialista-horarios/especialista-horarios.component";

@Component({
  selector: 'app-especialista-perfil',
  standalone: true,
  imports: [CommonModule, EspecialistaHorariosComponent],
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

  usuario!: Usuario;
  email: string = "";
  private subscription: Subscription = new Subscription();


  ngOnInit(): void {
    this.auth.DatosAutenticacion().subscribe({
      next: (email) => {
        if (email) {
          this.email = email;
          this.traerUsuario(this.email);
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
