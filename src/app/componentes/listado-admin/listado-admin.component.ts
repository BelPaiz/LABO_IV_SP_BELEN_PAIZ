import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Subscription } from 'rxjs';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-listado-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-admin.component.html',
  styleUrl: './listado-admin.component.css'
})
export class ListadoAdminComponent {
  constructor(private firestore: FirestoreService) { }

  ngOnInit(): void {
    this.generarTabla();
  }

  usuarios!: Usuario[];
  private subscription: Subscription = new Subscription();

  generarTabla() {
    const subs = this.firestore.getUsuariosPorTipo('admin')
      .subscribe((respuesta) => {
        this.usuarios = respuesta;
      });
    this.subscription.add(subs);
  }

  // seleccionarEmpleado(dni: number) {
  //   this.empleadoElegido.emit(dni);
  // }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
