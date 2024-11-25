import { Component } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-informes',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './informes.component.html',
  styleUrl: './informes.component.css'
})
export class InformesComponent {
  constructor(public loader: LoaderService,
    private router: Router,
    private data: DataService
  ) { }

  ngOnInit(): void {
    this.loader.setLoader(true);
    setTimeout(() => {
      this.loader.setLoader(false);
    }, 500);
  };

  irInforme4(estado: string) {
    this.data.setEstado(estado);
    this.router.navigate(['/informes-4']);
  }
}
