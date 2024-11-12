import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-listado-pacientes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-pacientes.component.html',
  styleUrl: './listado-pacientes.component.css'
})
export class ListadoPacientesComponent {

  constructor(private firestore: FirestoreService) { }

  ngOnInit(): void {
    this.generarTabla();
  }

  usuarios!: Usuario[];
  private subscription: Subscription = new Subscription();

  generarTabla() {
    const subs = this.firestore.getUsuariosPorTipo('paciente')
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
