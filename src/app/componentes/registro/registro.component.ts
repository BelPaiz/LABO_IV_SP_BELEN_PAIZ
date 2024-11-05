import { Component, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent implements OnInit {

  constructor(public loader: LoaderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loader.setLoader(true);
    setTimeout(() => {
      this.loader.setLoader(false);
    }, 500);
  };

  irRegistro_paciente() {
    this.router.navigate(['/registro_paciente']);
  }

  irRegistro_medico() {
    this.router.navigate(['/registro_especialista']);
  }

}
