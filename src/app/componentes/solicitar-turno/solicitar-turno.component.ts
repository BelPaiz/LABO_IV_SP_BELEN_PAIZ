import { Component, ViewChild } from '@angular/core';
import { SeleccionEspecialidadComponent } from "../seleccion-especialidad/seleccion-especialidad.component";
import { SeleccionEspecialistaComponent } from "../seleccion-especialista/seleccion-especialista.component";
import { SeleccionDiaComponent } from '../seleccion-dia/seleccion-dia.component';
import { SeleccionHoraComponent } from '../seleccion-hora/seleccion-hora.component';
import { Disponibilidad } from '../../models/disponibilidad_horaria';
import { LoaderService } from '../../services/loader.service';

@Component({
  selector: 'app-solicitar-turno',
  standalone: true,
  imports: [SeleccionEspecialidadComponent, SeleccionEspecialistaComponent, SeleccionDiaComponent, SeleccionHoraComponent],
  templateUrl: './solicitar-turno.component.html',
  styleUrl: './solicitar-turno.component.css'
})
export class SolicitarTurnoComponent {

  constructor(public loader: LoaderService
  ) { }

  @ViewChild(SeleccionEspecialidadComponent) especialidad_seleccion!: SeleccionEspecialidadComponent
  @ViewChild(SeleccionEspecialistaComponent) medico_seleccion!: SeleccionEspecialistaComponent
  @ViewChild(SeleccionDiaComponent) dia_seleccion!: SeleccionDiaComponent
  @ViewChild(SeleccionDiaComponent) fecha_seleccion!: SeleccionDiaComponent


  ngOnInit(): void {
    this.loader.setLoader(true);
    setTimeout(() => {
      this.loader.setLoader(false);
    }, 500);
  };

  especialidadElegida!: string;
  medicoElegido!: string;
  disponible_dia!: Disponibilidad;
  fecha_selec!: string;



  recibirEspecialidad(nombre: string) {
    this.especialidadElegida = nombre;
  }
  recibirEspecialista(email: string) {
    this.medicoElegido = email;
  }
  recibirDisponible(disponible: Disponibilidad) {
    this.disponible_dia = disponible;
  }
  recibirFecha(fecha: string) {
    this.fecha_selec = fecha;
  }

}
