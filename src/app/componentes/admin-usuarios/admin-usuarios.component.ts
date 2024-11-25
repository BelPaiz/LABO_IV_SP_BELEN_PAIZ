import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ListadoPacientesComponent } from "../listado-pacientes/listado-pacientes.component";
import { ListadoEspecialistasComponent } from "../listado-especialistas/listado-especialistas.component";
import { ListadoAdminComponent } from "../listado-admin/listado-admin.component";
import { CommonModule } from '@angular/common';
import { ExcelService } from '../../services/excel.service';
import { Subscription } from 'rxjs';
import { Usuario } from '../../models/usuario';
import { FirestoreService } from '../../services/firestore.service';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ListadoPacientesComponent, ListadoEspecialistasComponent, ListadoAdminComponent, CommonModule],
  templateUrl: './admin-usuarios.component.html',
  styleUrl: './admin-usuarios.component.css',
  animations: []
})
export class AdminUsuariosComponent {

  constructor(private excel: ExcelService,
    private firestore: FirestoreService
  ) { }


  ngOnInit(): void {
    this.traerUsuarios();
  }

  usuarios!: Usuario[];
  users_paciente!: Usuario[];
  users_especialista!: Usuario[];
  users_admin!: Usuario[];


  private subscription: Subscription = new Subscription();

  opcionSeleccionada: number = 0;

  seleccionarVer(opcion: number) {
    this.opcionSeleccionada = opcion;
  }

  traerUsuarios() {
    this.usuarios = [];
    const subs = this.firestore.getUsuariosAll()
      .subscribe((respuesta) => {
        this.usuarios = respuesta;
        this.obtenerListas();
      });
    this.subscription.add(subs);
  }

  obtenerListas() {
    this.users_paciente = [];
    this.users_especialista = [];
    this.users_admin = [];

    for (let i = 0; i < this.usuarios.length; i++) {
      switch (this.usuarios[i].tipo) {
        case 'paciente':
          this.users_paciente.push(this.usuarios[i]);
          break;
        case 'especialista':
          this.users_especialista.push(this.usuarios[i]);
          break;
        case 'admin':
          this.users_admin.push(this.usuarios[i]);
          break;
      }
    }
  }
  descargarCsv(): void {
    this.excel.exportarCSV(this.usuarios, 'Listado_de_Usuarios', ['nombre', 'apellido', 'edad', 'dni', 'email', 'tipo']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
