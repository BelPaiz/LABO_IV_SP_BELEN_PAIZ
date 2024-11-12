import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Subscription } from 'rxjs';
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

  constructor(private firestore: FirestoreService) { }

  ngOnInit(): void {
    this.generarTabla();
  }

  usuarios!: Usuario[];
  private subscription: Subscription = new Subscription();

  generarTabla() {
    const subs = this.firestore.getUsuariosPorTipo('especialista')
      .subscribe((respuesta) => {
        this.usuarios = respuesta;
      });
    this.subscription.add(subs);
  }

  // seleccionarEmpleado(dni: number) {
  //   this.empleadoElegido.emit(dni);
  // }

  cambiosHabilitado(usuario: any) {
    this.firestore.updateEspecialista(usuario.dni, usuario.habilitado)
      .then(() => {
        console.log("Campo habilitado actualizado");
      })
      .catch((error) => {
        console.log("hubo un error");
      })
  }


  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
