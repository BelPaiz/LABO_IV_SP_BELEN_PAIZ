import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ListadoPacientesComponent } from "../listado-pacientes/listado-pacientes.component";
import { ListadoEspecialistasComponent } from "../listado-especialistas/listado-especialistas.component";
import { ListadoAdminComponent } from "../listado-admin/listado-admin.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, ListadoPacientesComponent, ListadoEspecialistasComponent, ListadoAdminComponent, CommonModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.css'
})
export class AdminUsuariosComponent {

  opcionSeleccionada: number = 0;



  seleccionarVer(opcion: number) {
    this.opcionSeleccionada = opcion;
  }


}
