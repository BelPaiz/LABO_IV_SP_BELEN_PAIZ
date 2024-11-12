import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthenService } from './services/authen.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "./componentes/loader/loader.component";
import { FirestoreService } from './services/firestore.service';
import { AdminUsuariosComponent } from './componentes/admin-usuarios/admin-usuarios.component';
import { of, Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, LoaderComponent, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  title = 'clinica';
  constructor(private router: Router,
    private auth: AuthenService,
    private firestore: FirestoreService) { }

  usuario: any;
  usuario_completo: any;
  user: any;
  mostrarUser: boolean = false;
  dropdownOpen: boolean = false;
  tipoUsuario!: string;
  ocultar: boolean = false;
  mostrar: boolean = false;
  mostrarEsp: boolean = false;
  mostrarPac: boolean = false;

  private subscription: Subscription = new Subscription();
  nombre_usuario: string = "";

  ngOnInit() {
    const subs = this.auth.DatosAutenticacion().pipe(
      switchMap(email => {
        if (email) {
          this.usuario = email;
          // Llama a `getUsuarioPorEmail` que devuelve un Observable con los usuarios
          return this.firestore.getUsuarioPorEmail(email);
        } else {
          // Si no hay email, retorna un Observable vacío para manejar el caso sin usuario
          return of(null);
        }
      })
    ).subscribe({
      next: (users) => {
        if (users && users.length > 0) {
          this.user = users[0];  // Obtén el primer usuario del array
          this.tipoUsuario = this.user['tipo'];
          this.mostrarUser = true;
          this.ocultar = true;

          // Muestra o oculta la administración basado en el tipo de usuario
          this.mostrar = this.tipoUsuario === 'admin';
          this.mostrarEsp = this.tipoUsuario === 'especialista';
          this.mostrarPac = this.tipoUsuario === 'paciente';
          this.usuario_completo = `${this.user['nombre']} ${this.user['apellido']}`;
        } else {
          // Usuario no autenticado o no encontrado en Firestore
          this.usuario = null;
          this.mostrarUser = false;
          this.mostrar = false;
          this.ocultar = this.auth.isAuthenticated();
          this.usuario_completo = "";
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
    this.subscription.add(subs);
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  cerrarSesion() {
    this.auth.CerrarSesion().then(() => {
      this.usuario_completo = "";
      this.router.navigate(['/login']);
    })
      .catch(e => console.log(e));
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  async traerUsuario(email: string) {
    try {
      const res = await this.firestore.getHabilitadoMail(email);
      // this.tipoUsuario = res['tipo'];
      this.user = res;

    } catch (e) {
      // console.log(e);
    }
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
