import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthenService } from './services/authen.service';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from "./componentes/loader/loader.component";
import { FirestoreService } from './services/firestore.service';
import { AdminUsuariosComponent } from './componentes/admin-usuarios/admin-usuarios.component';

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
  mostrarUser: boolean = false;
  dropdownOpen: boolean = false;
  tipoUsuario!: string;
  ocultar: boolean = false;
  mostrar: boolean = false;

  async ngOnInit() {
    this.auth.DatosAutenticacion().subscribe({
      next: async (email) => {
        if (email) {
          this.usuario = email;
          this.mostrarUser = true;
          this.ocultar = true;

          await this.tipoUser(this.usuario);
          if (this.tipoUsuario === 'admin') {
            this.mostrar = true; // Mostrar administración para admin

            console.log("es admin");
          } else {
            this.mostrar = false;

          }

        } else {
          // Usuario no autenticado
          this.usuario = null;
          this.mostrarUser = false;
          this.mostrar = false;
          this.ocultar = this.auth.isAuthenticated();
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  cerrarSesion() {
    this.auth.CerrarSesion().then(() => {
      this.router.navigate(['/login']);
    })
      .catch(e => console.log(e));
  }
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }
  hiceClick() {
    console.log("click");
  }

  async tipoUser(email: string) {
    try {
      const res = await this.firestore.getHabilitadoMail(email);
      this.tipoUsuario = res['tipo'];
    } catch (e) {
      // console.log(e);
    }
  }
}
