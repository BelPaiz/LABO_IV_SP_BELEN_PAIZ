import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { AuthenService } from '../../services/authen.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  constructor(private firestore: FirestoreService,
    private auth: AuthenService,
    private router: Router,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.auth.CerrarSesion();
  }

  email: string = "";
  clave: string = "";
  logsCol: any[] = [];
  counts: number = 0;
  usuarioLogueado: string = "";
  error: string = "";
  usuarioDefecto: string[] = ["belen.b.paiz2206@gmail.com", "joxaji1299@gianes.com", "bernardette.belen@gmail.com"];
  passDefecto: string[] = ["123456", "123456", "123456"];
  ocultar: boolean = true;
  tipoUsuario!: string;

  login() {
    this.loader.setLoader(true);
    this.auth.Login(this.email, this.clave)
      .then(async (user) => {
        if (user) {
          if (user.emailVerified) {
            if (user.email) {
              let habilitado = await this.habilitado(user.email);
              if (!habilitado) {
                this.error = "Debes esperar que el administrador te habilite."
                this.auth.CerrarSesion();
                this.loader.setLoader(false);
              } else {
                this.usuarioLogueado = user.email;
                this.firestore.loginRegister(this.usuarioLogueado);
                this.ocultar = false;
                this.loader.setLoader(false);
                if (this.tipoUsuario == 'admin') {
                  this.router.navigate(['/admin-usuarios']);
                  this.loader.setLoader(false);
                } else {
                  this.router.navigate(['/home']);
                  this.loader.setLoader(false);
                }
              }
            }
          }
          else {
            this.error = "Debes verificar tu correo electrónico antes de iniciar sesión.";
            this.loader.setLoader(false);
          }
        }
      }).catch((e) => {
        if (e = 'auth/invalid-credential') {
          this.error = "Usuario y/o contraseña invalido";
          this.loader.setLoader(false);
        } else {
          this.error = e;
        }
      });
  }

  async habilitado(email: string): Promise<boolean> {
    try {
      const res = await this.firestore.getHabilitadoMail(email);
      this.tipoUsuario = res['tipo'];

      return !!res['habilitado'];
    } catch (e) {
      return false;
    }
  }

  getData() {
    this.firestore.getData(this.counts, this.logsCol);
  }
  rellenarUsuario(index: number) {
    this.email = this.usuarioDefecto[index];
    this.clave = this.passDefecto[index];
    this.limpiar();
  }
  limpiar() {
    this.error = "";
  }
  cerrarSesion() {
    this.auth.CerrarSesion().then(() => {
      this.ocultar = true;
    })
      .catch(e => console.log(e));
  }
}
