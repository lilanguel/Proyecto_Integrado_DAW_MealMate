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
    // Obtiene el usuario actual del servicio de autenticación
    this.user = this.authService.getUser();
    // Obtiene las dietas del usuario
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
    // Muestra un diálogo de confirmación para generar una nueva dieta
    Swal.fire({
      title: 'Generar dieta',
      text: '¿Estás seguro de que quieres generar una nueva tabla de dieta semanal?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Rechazar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Realiza una solicitud para generar una nueva dieta
        this.dietaService.generarDieta(this.user).subscribe(
          (res) => {
            location.reload(); // Recarga la página después de generar la dieta
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
    // Obtiene las dietas del usuario
    this.dietaService.obtenerDietas(this.user).subscribe(
      (response: any) => {
        this.dietas = response.dietas;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  obtenerComidaPorHorario(comidas: any[], horario: string) {
    // Obtiene la comida correspondiente a un horario específico en la lista de comidas
    return comidas.find((comida) => comida.horario === horario);
  }
}
