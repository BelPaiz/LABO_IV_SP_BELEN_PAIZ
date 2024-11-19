import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-seleccion-especialista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seleccion-especialista.component.html',
  styleUrl: './seleccion-especialista.component.css'
})
export class SeleccionEspecialistaComponent implements OnChanges {
  @Input() especialidad_elegida: string | null = null;
  @Output() especialista_elegido = new EventEmitter<string>();

  constructor(private firestore: FirestoreService) { }
  espec_selec!: any;
  especialistas: any[] = [];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['especialidad_elegida'] && changes['especialidad_elegida'].currentValue) {
      this.espec_selec = this.especialidad_elegida;
      this.traerEspecialista();
    }
  }

  traerEspecialista() {
    this.firestore.obtenerUsuariosPorEspecialidad(this.espec_selec).then(usuarios => {
      this.especialistas = usuarios;
    });
  }
  seleccion(email: string) {
    this.especialista_elegido.emit(email);
  }


}
