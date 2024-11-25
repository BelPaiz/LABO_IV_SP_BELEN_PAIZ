import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoaderService } from '../../services/loader.service';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';
import { Turno } from '../../models/turno';
import { FirestoreService } from '../../services/firestore.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-completar-hc',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './completar-hc.component.html',
  styleUrl: './completar-hc.component.css'
})
export class CompletarHcComponent {

  constructor(public loader: LoaderService,
    private data: DataService,
    private firestore: FirestoreService,
    private router: Router
  ) { }


  form!: FormGroup;
  mensaje: string = "";
  turno!: Turno;



  ngOnInit(): void {
    this.loader.setLoader(true);
    setTimeout(() => {
      this.loader.setLoader(false);
    }, 500);

    this.form = new FormGroup({
      altura: new FormControl('', [Validators.required, Validators.pattern('^\\d{2,3}$')]),
      peso: new FormControl('', [Validators.required, Validators.pattern('^\\d{2,3}$')]),
      temperatura: new FormControl('', [Validators.required, Validators.pattern('^\\d{1,2}(,\\d+)?$'), this.minMaxValidator(25, 45)]),
      presion1: new FormControl('', [Validators.required, Validators.pattern('^\\d{2,3}$')]),
      presion2: new FormControl('', [Validators.required, Validators.pattern('^\\d{2,3}$')]),
      dato1a: new FormControl('', [Validators.pattern('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)?(,[a-zA-Z0-9 ]+)?$')]),
      dato1b: new FormControl('', [Validators.pattern('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)?(,[a-zA-Z0-9 ]+)?$')]),
      dato2a: new FormControl('', [Validators.pattern('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)?(,[a-zA-Z0-9 ]+)?$')]),
      dato2b: new FormControl('', [Validators.pattern('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)?(,[a-zA-Z0-9 ]+)?$')]),
      dato3a: new FormControl('', [Validators.pattern('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)?(,[a-zA-Z0-9 ]+)?$')]),
      dato3b: new FormControl('', [Validators.pattern('^[a-zA-Z0-9]+( [a-zA-Z0-9]+)?(,[a-zA-Z0-9 ]+)?$')]),
    });
  }

  guardarHistoria() {
    if (this.form.valid) {
      const id = this.data.getTurno();
      if (id !== "") {
        const data = {
          historia: true,
          altura: this.altura,
          peso: this.peso,
          temperatura: this.temperatura,
          presion: [this.presion1, this.presion2],
          dato_uno: [this.dato1a, this.dato1b],
          dato_dos: [this.dato2a, this.dato2b],
          dato_tres: [this.dato3a, this.dato3b]
        }
        this.firestore.updateTurnoHistoria(id, data)
          .then(() => {
            this.limpiarCampos();
            this.mensaje = "Historia clinica actualizada correctamente, será redirigido."
            setTimeout(() => {
              this.limpiarMensaje();
              this.router.navigate(['/ver-turnos-especialista']);
            }, 2500);
          })
          .catch(error => {
            console.error(error);
          });
      }
      else {
        setTimeout(() => {
          this.mensaje = "Error al obtener información del turno, vuelva a intentar"
          this.router.navigate(['/ver-turnos-especialista']);
        }, 2500);

      }
    } else {
      this.mensaje = "Verifique la correcta integracion de los campos"
    }
  }

  limpiarCampos() {
    this.form.reset();
    this.mensaje = "";
  }
  limpiarMensaje() {
    this.mensaje = "";
  }



  // Custom Validator para validar rango mínimo y máximo
  minMaxValidator(min: number, max: number) {
    return (control: any) => {
      if (!control.value) return null;

      // Reemplazar la coma con un punto para manejarlo como número
      const valor = parseFloat(control.value.replace(',', '.'));

      if (valor < min || valor > max) {
        return { outOfRange: true };
      }
      return null;
    };
  }

  get altura() {
    return this.form.get('altura')?.value;
  }
  get peso() {
    return this.form.get('peso')?.value;
  }
  get temperatura() {
    return this.form.get('temperatura')?.value;
  }
  get presion1() {
    return this.form.get('presion1')?.value;
  }
  get presion2() {
    return this.form.get('presion2')?.value;
  }
  get dato1a() {
    return this.form.get('dato1a')?.value;
  }
  get dato1b() {
    return this.form.get('dato1b')?.value;
  }
  get dato2a() {
    return this.form.get('dato2a')?.value;
  }
  get dato2b() {
    return this.form.get('dato2b')?.value;
  }
  get dato3a() {
    return this.form.get('dato3a')?.value;
  }
  get dato3b() {
    return this.form.get('dato3b')?.value;
  }

}
