import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ejercicio } from 'src/app/interfaces/ejercicio.interface';
import { AuthService } from 'src/app/services/auth.service';
import { RutinaService } from 'src/app/services/rutina.service';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

declare var bootstrap: any; // Declaración para acceder a los métodos de Bootstrap
@Component({
  selector: 'app-rutina',
  templateUrl: './rutina.component.html',
  styleUrls: ['./rutina.component.css'],
})
export class RutinaComponent implements OnInit, AfterViewInit {
  diaSemana: string = '';
  user: any;
  rutina: Ejercicio[] = [];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private rutinaService: RutinaService,
    private userService: UserService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    // Obtiene el parámetro 'dia' de la ruta
    this.route.params.subscribe((params) => {
      this.diaSemana = params['dia'];
      this.user = this.authService.getUser();
    });

    // Obtiene la rutina del usuario para el día de la semana actual
    this.userService
      .getRutina(this.user, this.diaSemana)
      .subscribe((res: any) => {
        this.rutina = res.map((ejercicio: Ejercicio) => {
          return ejercicio;
        });
      });
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

  generarRutina() {
    // Muestra una confirmación utilizando SweetAlert2 para generar una nueva rutina semanal
    Swal.fire({
      title: 'Generar rutina',
      text: '¿Estás seguro de que quieres generar una nueva rutina semanal?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Rechazar',
    }).then((result) => {
      if (result.isConfirmed) {
        // Llama al método de generación de rutina del servicio de rutina
        this.rutinaService.generarRutina(this.user).subscribe(
          (respuesta) => {
            this.toastr.success(
              `¡Tu rutina se ha generado con éxito!`,
              'Rutina generada'
            );
            location.reload();
          },
          (error) => {
            this.toastr.error(
              `No se ha podido generar una nueva rutina`,
              'Error'
            );
          }
        );
      }
    });
  }
}
