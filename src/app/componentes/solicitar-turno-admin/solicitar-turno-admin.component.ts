import { Component } from '@angular/core';
import { FirestoreService } from '../../services/firestore.service';
import { Usuario } from '../../models/usuario';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoaderService } from '../../services/loader.service';
import { DataService } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-solicitar-turno-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './solicitar-turno-admin.component.html',
  styleUrl: './solicitar-turno-admin.component.css'
})
export class SolicitarTurnoAdminComponent {

  constructor(private firestore: FirestoreService,
    public loader: LoaderService,
    private data: DataService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loader.setLoader(true);
    this.generarTabla();
  }

  usuarios!: Usuario[];
  private subscription: Subscription = new Subscription();

  generarTabla() {
    const subs = this.firestore.getUsuariosPorTipo('paciente')
      .subscribe((respuesta) => {
        this.usuarios = respuesta;
        this.loader.setLoader(false);
      });
    this.subscription.add(subs);
  }

  seleccionarPaciente(email: string) {
    this.data.setEmail(email);
    this.router.navigate(['/solicitar-turno']);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
