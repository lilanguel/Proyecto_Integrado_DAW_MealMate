import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { DietaService } from 'src/app/services/dieta.service';
import Swal from 'sweetalert2';

declare var bootstrap: any; // Declaración para acceder a los métodos de Bootstrap

@Component({
  selector: 'app-dieta',
  templateUrl: './dieta.component.html',
  styleUrls: ['./dieta.component.css'],
})
export class DietaComponent implements OnInit, AfterViewInit {
  user: any;
  dietas: any[] = [];

  constructor(
    private authService: AuthService,
    private dietaService: DietaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.obtenerDietas();
  }

  ngAfterViewInit() {
    // Inicializar tooltips después de que se haya cargado la vista
    const tooltipTriggerList = [].slice.call(
      document.querySelectorAll('[data-bs-toggle="tooltip"]')
    );
    tooltipTriggerList.map((tooltipTriggerEl: HTMLElement) => {
      return new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  generarDieta() {
    Swal.fire({
      title: 'Generar dieta',
      text: '¿Estás seguro de que quieres generar una nueva tabla de dieta semanal?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Rechazar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dietaService.generarDieta(this.user).subscribe(
          (res) => {
            location.reload();
            this.toastr.success(
              `¡Tu dieta se ha generado con éxito!`,
              'Dieta generada'
            );
          },
          (error) => {
            this.toastr.error(
              `No se ha podido generar una nueva dieta`,
              'Error'
            );
          }
        );
      }
    });
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
}
