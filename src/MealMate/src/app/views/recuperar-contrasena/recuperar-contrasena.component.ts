import { Component } from '@angular/core';
import { MailService } from 'src/app/services/mail.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-recuperar-contrasena',
  templateUrl: './recuperar-contrasena.component.html',
  styleUrls: ['./recuperar-contrasena.component.css'],
})
export class RecuperarContrasenaComponent {
  correoElectronico: string = '';

  constructor(
    private mailService: MailService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  enviarCorreo() {
    // Llama al método de recuperación de contraseña del servicio de correo
    this.mailService.recuperarContraseña(this.correoElectronico).subscribe(
      (response) => {
        this.toastr.info(
          'Se ha enviado un correo con tu nueva contraseña',
          'Correo enviado'
        );
        this.router.navigate(['/signin']);
      },
      (error) => {
        this.toastr.error(
          'No se ha podido enviar la nueva contraseña',
          'Error al enviar el correo'
        );
      }
    );
  }
}
