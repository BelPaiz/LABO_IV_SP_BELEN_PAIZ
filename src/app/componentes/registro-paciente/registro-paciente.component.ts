import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenService } from '../../services/authen.service';
import { confirmarCalveValidator } from '../../validadores/clave.validator';
import { StorageService } from '../../services/storage.service';
import { FirestoreService } from '../../services/firestore.service';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { recaptcha } from '../../../../enviromentCap';
import { Usuario } from '../../models/usuario';


@Component({
  selector: 'app-registro-paciente',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RecaptchaModule, RecaptchaFormsModule],
  templateUrl: './registro-paciente.component.html',
  styleUrl: './registro-paciente.component.css',
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: recaptcha.siteKey } as RecaptchaSettings,
    },
  ],
})
export class RegistroPacienteComponent implements OnInit {
  constructor(private router: Router,
    public loader: LoaderService,
    private auth: AuthenService,
    private storage: StorageService,
    private firestore: FirestoreService,
  ) { }

  form!: FormGroup;
  image1Error: string | null = null;
  image2Error: string | null = null;
  img1: string = "";
  img2: string = "";
  error: string = "";
  acept: string = "";
  token: string | null = null;
  paciente!: Usuario;


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
      obra_social: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'), Validators.minLength(3), Validators.maxLength(20)]),
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

  uploadImage($event: any, imageNumber: number) {
    const inputElement = $event.target as HTMLInputElement;
    this.storage.SubirImagen($event)
      .then(base64String => {

        if (imageNumber === 1) {
          this.image1Error = null;
          this.img1 = base64String;
        } else if (imageNumber === 2) {
          this.image2Error = null;
          this.img2 = base64String;
        }
      })
      .catch(error => {
        if (imageNumber === 1) {
          this.image1Error = error;
        } else if (imageNumber === 2) {
          this.image2Error = error;
        }
        inputElement.value = "";
      });
  }

  async enviar() {
    let paciente = null;
    if (this.form.valid && this.img1 !== '' && this.img2 !== '') {
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
        this.paciente = {
          nombre: this.nombre?.value,
          apellido: this.apellido?.value,
          edad: this.edad?.value,
          dni: this.dni?.value,
          obra_social: this.obra_social?.value,
          especialidad: null,
          email: this.email?.value,
          img1: this.img1,
          img2: this.img2,
          tipo: 'paciente',
          habilitado: true
        }
        this.firestore.nuevoUsuario(this.paciente);
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
    this.img1 = "";
    this.img2 = "";
    const fileInput1 = document.getElementById('formFile1') as HTMLInputElement;
    const fileInput2 = document.getElementById('formFile2') as HTMLInputElement;
    if (fileInput1) fileInput1.value = "";
    if (fileInput2) fileInput2.value = "";
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
  get obra_social() {
    return this.form.get('obra_social');
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
