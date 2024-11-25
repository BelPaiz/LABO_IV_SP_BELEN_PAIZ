import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderService } from '../../services/loader.service';
import { AuthenService } from '../../services/authen.service';
import { StorageService } from '../../services/storage.service';
import { FirestoreService } from '../../services/firestore.service';
import { confirmarCalveValidator } from '../../validadores/clave.validator';
import { Subscription } from 'rxjs';
import { RECAPTCHA_SETTINGS, RecaptchaFormsModule, RecaptchaModule, RecaptchaSettings } from 'ng-recaptcha';
import { recaptcha } from '../../../../enviromentCap';
import { Usuario } from '../../models/usuario';
import { PrimeraMayusculaDirective } from '../../directivas/primera-mayuscula.directive';
import { BlockPegarDirective } from '../../directivas/block-pegar.directive';

@Component({
  selector: 'app-registro-especialista',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RecaptchaModule, RecaptchaFormsModule, PrimeraMayusculaDirective, BlockPegarDirective],
  templateUrl: './registro-especialista.component.html',
  styleUrl: './registro-especialista.component.css',
  providers: [
    {
      provide: RECAPTCHA_SETTINGS,
      useValue: { siteKey: recaptcha.siteKey } as RecaptchaSettings,
    },
  ],
})
export class RegistroEspecialistaComponent {
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
  especialidades: any = [];
  especialidadSeleccionada!: string;
  private subscription: Subscription = new Subscription();
  nuevaEspecialidad: string = "";
  token: string | null = null;
  usuario!: Usuario;


  ngOnInit(): void {
    this.loader.setLoader(true);
    setTimeout(() => {
      this.loader.setLoader(false);
    }, 500);

    if (this.especialidades.length === 0) {
      this.obtenerEspecialidades();
    }

    this.form = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'), Validators.maxLength(20)]),
      apellido: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$'), Validators.maxLength(20)]),
      edad: new FormControl('', [Validators.required, Validators.pattern('^^\\d{1,3}$')]),
      dni: new FormControl('', [Validators.required, Validators.pattern('^\\d{7,8}$')]),
      especialidad: new FormArray([], Validators.required),
      especialidadTexto: new FormControl('', Validators.required), // Campo que mostrará el texto de especialidades seleccionadas
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
    let especialista = null;
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
          especialidad: this.especialidad?.value,
          email: this.email?.value,
          img1: this.img1,
          img2: null,
          tipo: 'especialista',
          habilitado: false
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

  actualizarEspecialidad(event: Event) {
    const select = event.target as HTMLSelectElement;
    const formArray = this.form.get('especialidad') as FormArray;
    this.form.get('especialidad')?.markAsTouched();
    this.form.get('especialidad')?.markAsDirty();

    formArray.clear();

    for (let i = 0; i < select.selectedOptions.length; i++) {
      const selectedOption = select.selectedOptions[i].value;
      formArray.push(new FormControl(selectedOption));
    }
    const especialidadesSeleccionadas = formArray.value as string[];
    this.form.get('especialidadTexto')?.setValue(especialidadesSeleccionadas.join(', '));
  }

  obtenerEspecialidades() {
    const subs = this.firestore.getEspecialidades().subscribe((respuesta) => {
      this.especialidades = respuesta;
    });
    this.subscription.add(subs);
  }
  crearEspecialidad() {
    if (this.nuevaEspecialidad !== "") {
      this.firestore.setEspecialidad(this.nuevaEspecialidad);
      this.nuevaEspecialidad = "";
    }
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
  get especialidad() {
    return this.form.get('especialidad');
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

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }



}
