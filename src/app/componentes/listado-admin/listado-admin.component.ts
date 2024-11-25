import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Usuario } from '../../models/usuario';

@Component({
  selector: 'app-listado-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './listado-admin.component.html',
  styleUrl: './listado-admin.component.css'
})
export class ListadoAdminComponent {

  @Input() usuarios!: Usuario[];

}
