import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { Disponibilidad } from '../../models/disponibilidad_horaria';
import { CommonModule } from '@angular/common';
import { FechasService } from '../../services/fechas.service';
import { FormatoFechaPipe } from "../../pipes/formato-fecha.pipe";


@Component({
  selector: 'app-seleccion-dia',
  standalone: true,
  imports: [CommonModule, FormatoFechaPipe],
  templateUrl: './seleccion-dia.component.html',
  styleUrl: './seleccion-dia.component.css'
})
export class SeleccionDiaComponent implements OnChanges {

  constructor(private firestore: FirestoreService,
    private fecha_serv: FechasService
  ) { }


  @Input() especialista_elegido: string | null = null;
  @Output() disponibles = new EventEmitter<Disponibilidad>();
  @Output() fecha_seleccionada = new EventEmitter<string>();



  espec_selec!: any;
  private subscription: Subscription = new Subscription();
  disponibilidad!: Disponibilidad[];
  disponible_seleccionado!: Disponibilidad;
  fechas_disponibles: string[] = [];
  dias: string[] = [];
  fechas = [
    {
      dia: "",
      fecha: ""
    }
  ];
  fecha_obj: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['especialista_elegido'] && changes['especialista_elegido'].currentValue) {
      this.espec_selec = this.especialista_elegido;
      this.fechas_disponibles = [];
      this.fechas = [{ dia: "", fecha: "" }];
      this.dias = [];
      this.traerDisponibilidad(this.espec_selec);
    }
  }

  traerDisponibilidad(email: string) {
    const sub = this.firestore.getDisponibilidadPorMail(email)
      .subscribe({
        next: (disponible) => {
          if (disponible && disponible.length > 0) {

            this.disponibilidad = disponible;

            for (let index = 0; index < this.disponibilidad.length; index++) {
              this.fechas_disponibles.push(this.disponibilidad[index].fecha);
            }
            this.traerFechas();

          } else {
            this.dias = [];
          }
        },
        error: (error) => {
          console.error(error);
        }
      });
    this.subscription.add(sub);
  }

  traerFechas() {
    this.fechas = [];
    const hoy = new Date();
    this.fecha_obj = this.fecha_serv.traerProximos(hoy);

    for (let i = 0; i < this.fecha_obj.length; i++) {
      if (this.fechas_disponibles.includes(this.fecha_obj[i].fecha)) {
        this.fechas.push(this.fecha_obj[i]);
      }
    }
  }

  recuperarDia(fecha: string) {
    for (let i = 0; i < this.disponibilidad.length; i++) {
      if (this.disponibilidad[i].fecha === fecha) {
        this.disponible_seleccionado = this.disponibilidad[i];
        this.fecha_seleccionada.emit(fecha);
        this.disponibles.emit(this.disponible_seleccionado);
        return;
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
