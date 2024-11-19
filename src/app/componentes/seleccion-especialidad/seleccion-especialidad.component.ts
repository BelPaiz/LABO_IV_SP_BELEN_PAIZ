import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seleccion-especialidad',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seleccion-especialidad.component.html',
  styleUrl: './seleccion-especialidad.component.css'
})
export class SeleccionEspecialidadComponent implements OnInit, OnDestroy {

  @Output() especialidad_elegida = new EventEmitter<string>();

  constructor(
    private firestore: FirestoreService,
    private router: Router
  ) { }

  especialidades: any = [];
  especialImagen: any = [];
  espe!: { nombre: string, src: string };


  private subscription: Subscription = new Subscription();

  ngOnInit(): void {
    if (this.especialidades.length === 0) {
      this.obtenerEspecialidades();
    }
  }

  obtenerEspecialidades() {
    const subs = this.firestore.getEspecialidades().subscribe((respuesta) => {
      this.especialidades = respuesta;
      this.cargarImagen();

    });
    this.subscription.add(subs);

  }

  cargarImagen() {
    if (this.especialidades) {
      if (this.especialImagen.length === 0) {
        for (let i = 0; i < this.especialidades.length; i++) {
          switch (this.especialidades[i].nombre) {
            case "Geriatría":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/Geriat.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            case "Nefrología":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/Nefrologia.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            case "Obstetricia":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/obstetricia.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            case "Neumología":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/neumologia.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            case "Hematología":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/Hematologia.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            case "Neurología":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/NeurologIA.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            case "Cardiología":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/Cardiología.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            case "Ginecología":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/Ginecologia.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            case "Cirugía":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/cirugia.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            case "Gastroenterología":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/Gastroenterologia.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            case "Medicina general":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/Medicina general.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            case "Dermatología":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/Dermatología.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            case "Pediatría":
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/Pediatría.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
            default:
              this.espe = {
                nombre: this.especialidades[i].nombre,
                src: '../../../assets/images/especialidades/generica.jpg'
              }
              this.especialImagen.push(this.espe);
              break;
          }

        }
      }
    }
  }
  seleccion(nombre: string) {
    this.especialidad_elegida.emit(nombre);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
