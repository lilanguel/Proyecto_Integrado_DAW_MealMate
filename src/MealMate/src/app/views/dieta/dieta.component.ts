import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DietaService } from 'src/app/services/dieta.service';

@Component({
  selector: 'app-dieta',
  templateUrl: './dieta.component.html',
  styleUrls: ['./dieta.component.css'],
})
export class DietaComponent implements OnInit {
  user: any;
  dietas: any[] = [];
  comidaSeleccionada: any = null;

  constructor(
    private authService: AuthService,
    private dietaService: DietaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.obtenerDietas();
  }

  generarDieta() {
    this.dietaService.generarDieta(this.user).subscribe(
      (res) => {
        this.toastr.success(
          `¡Tu dieta se ha generado con éxito!`,
          'Dieta generada'
        );
        location.reload();
      },
      (error) => {
        this.toastr.error(`No se ha podido generar una nueva dieta`, 'Error');
      }
    );
  }

  obtenerDietas() {
    this.dietaService.obtenerDietas(this.user).subscribe(
      (response: any) => {
        this.dietas = response.dietas;
        console.log(this.dietas);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  obtenerComidaPorHorario(comidas: any[], horario: string) {
    return comidas.find((comida) => comida.horario === horario);
  }

  seleccionarComida(comida: any) {
    this.comidaSeleccionada = comida;
  }
}
