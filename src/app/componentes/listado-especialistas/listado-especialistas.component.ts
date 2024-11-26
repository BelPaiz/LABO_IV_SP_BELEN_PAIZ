import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { FormsModule } from '@angular/forms';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-listado-especialistas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './listado-especialistas.component.html',
  styleUrl: './listado-especialistas.component.css'
})
export class ListadoEspecialistasComponent {

  @Input() usuarios!: Usuario[];

  constructor(private firestore: FirestoreService) { }

  cambiosHabilitado(usuario: any) {
    this.firestore.updateEspecialista(usuario.dni, usuario.habilitado)
      .then(() => {
        console.log("habilitado");
      })
      .catch((error) => {
        console.log("hubo un error");
      })
  }
}
