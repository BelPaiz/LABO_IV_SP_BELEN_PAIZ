import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { AuthenService } from '../../services/authen.service';
import { StorageService } from '../../services/storage.service';
import { FirestoreService } from '../../services/firestore.service';
import { confirmarCalveValidator } from '../../validadores/clave.validator';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { recaptcha } from '../../../../enviromentCap';
import { Usuario } from '../../models/usuario';
import { PrimeraMayusculaDirective } from '../../directivas/primera-mayuscula.directive';
import { BlockPegarDirective } from '../../directivas/block-pegar.directive';

@Component({
  selector: 'app-registro-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RecaptchaModule, RecaptchaFormsModule, PrimeraMayusculaDirective, BlockPegarDirective],
  templateUrl: './registro-admin.component.html',
  styleUrl: './registro-admin.component.css',
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: recaptcha.siteKey } as RecaptchaSettings,
    },
  ],
})
export class RegistroAdminComponent {
  constructor(private router: Router,
    public loader: LoaderService,
    private auth: AuthenService,
    private storage: StorageService,
    private firestore: FirestoreService
  ) { }

  form!: FormGroup;
  image1Error: string | null = null;
  img1: string = "";
  error: string = "";
  acept: string = "";
  token: string | null = null;
  usuario!: Usuario;

  ngOnInit(): void {
    this.loader.setLoader(true);
    setTimeout(() => {
      this.loader.setLoader(false);
    }, 500);

    this.form = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'), Validators.maxLength(20)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'), Validators.maxLength(20)]),
      edad: new FormControl('', [Validators.required, Validators.pattern('^^\\d{1,3}$')]),
      dni: new FormControl('', [Validators.required, Validators.pattern('^\\d{7,8}$')]),
      email: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'), Validators.maxLength(50)]),
      clave: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      repiteClave: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]),
      recaptcha: new FormControl('', Validators.required) // Campo reCAPTCHA
    }, confirmarCalveValidator());

  }

  onCaptchaResolved(token: string | null) {
    if (token) {
      this.token = token;
      this.form.get('recaptcha')?.setValue(token);  // Asigna solo si el token no es null
    }
  }

  uploadImage($event: any) {
    const inputElement = $event.target as HTMLInputElement;
    this.storage.SubirImagen($event)
      .then(base64String => {
        this.image1Error = null;
        this.img1 = base64String;
      })
      .catch(error => {
        this.image1Error = error;
        inputElement.value = "";
      });
  }

  async enviar() {
    let admin = null;
    if (this.form.valid && this.img1 !== '') {
      try {
        if (!this.token) {
          this.error = "Por favor, complete el reCAPTCHA";
          return;
        }
        const dniYaExiste = await this.firestore.dniExiste(this.dni?.value);
        if (dniYaExiste) {
          this.error = "El DNI ya se encuentra registrado";
          return;
        }
        const resp = await this.auth.Registro(this.email?.value, this.clave?.value);
        this.usuario = {
          nombre: this.nombre?.value,
          apellido: this.apellido?.value,
          edad: this.edad?.value,
          dni: this.dni?.value,
          obra_social: null,
          especialidad: null,
          email: this.email?.value,
          img1: this.img1,
          img2: null,
          tipo: 'admin',
          habilitado: true
        }
        this.firestore.nuevoUsuario(this.usuario);
        this.acept = "Se registro correctamente, por favor complete la validacion del email";
        setTimeout(() => {
          this.acept = " ";
        }, 6000);
        this.limpiarCampos();
      } catch (e) {
        const errorFire = e as { code?: string };

        switch (errorFire.code) {
          case 'auth/invalid-email':
            this.error = "Email incorrecto";
            break;
          case 'auth/email-already-in-use':
            this.error = "El email ya se encuentra registrado";
            break;
          default:
            this.error = "Ocurrió un error inesperado";
            break;
        }
      };
    }
    else {
      this.error = "Verifique la correcta integración de todos los campos";
    }
  }

  limpiarError() {
    this.error = "";
  }
  limpiarCampos() {
    this.form.reset();
  }

  get nombre() {
    return this.form.get('nombre');
  }
  get apellido() {
    return this.form.get('apellido');
  }
  get edad() {
    return this.form.get('edad');
  }
  get email() {
    return this.form.get('email');
  }
  get dni() {
    return this.form.get('dni');
  }
  get clave() {
    return this.form.get('clave');
  }
  get repiteClave() {
    return this.form.get('repiteClave');
  }
}
