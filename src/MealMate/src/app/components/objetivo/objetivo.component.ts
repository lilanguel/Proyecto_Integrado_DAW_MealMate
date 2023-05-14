import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { ObjetivoService } from 'src/app/services/objetivo.service';

@Component({
  selector: 'app-objetivo',
  templateUrl: './objetivo.component.html',
  styleUrls: ['./objetivo.component.css'],
})
export class ObjetivoComponent {
  user: any;

  constructor(
    private authService: AuthService,
    private objetivoService: ObjetivoService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  seleccionarObjetivo(opcion: string) {
    this.objetivoService.seleccionarObjetivo(this.user, opcion).subscribe(
      (res) => {
        this.toastr.success(`¡${opcion} es una muy buena opción!`,'Objetivo seleccionado');
        this.router.navigate(['/main']);
      },
      (err) => {
        this.toastr.error(`No se ha podido establacer el objetivo con éxito`,'Error');
      }
    );
  }
}
