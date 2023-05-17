import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Ejercicio } from 'src/app/interfaces/ejercicio.interface';
import { AuthService } from 'src/app/services/auth.service';
import { RutinaService } from 'src/app/services/rutina.service';
import { UserService } from 'src/app/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-rutina',
  templateUrl: './rutina.component.html',
  styleUrls: ['./rutina.component.css'],
})
export class RutinaComponent implements OnInit {
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
    this.route.params.subscribe((params) => {
      this.diaSemana = params['dia'];
      this.user = this.authService.getUser();
    });

    this.userService
      .getRutina(this.user, this.diaSemana)
      .subscribe((res: any) => {
        this.rutina = res.map((ejercicio: Ejercicio) => {
          return ejercicio;
        });
      });
  }

  generarRutina() {
    this.rutinaService.generarRutina(this.user).subscribe(
      (respuesta) => {
        this.toastr.success(
          `¡Tu rutina se ha generado con éxito!`,
          'Rutina generada'
        );
        location.reload();
      },
      (error) => {
        this.toastr.error(`No se ha podido generar una nueva rutina`, 'Error');
      }
    );
  }
}
