import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ValidatorFn,
  AbstractControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-cambiar-contrasena',
  templateUrl: './cambiar-contrasena.component.html',
  styleUrls: ['./cambiar-contrasena.component.css'],
})
export class CambiarContrasenaComponent implements OnInit {
  errorMessage: string = '';
  passwordForm: FormGroup;
  user: any;

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private authService: AuthService,
    private userService: UserService,
    private fb: FormBuilder
  ) {
    // Inicializa el formulario de cambio de contraseña
    this.passwordForm = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    // Obtiene el usuario actual del servicio de autenticación
    this.user = this.authService.getUser();
  }

  cambiarContrasena() {
    // Realiza una solicitud para cambiar la contraseña del usuario actual
    this.userService
      .cambiarContrasena(this.user, this.passwordForm.value)
      .subscribe(
        (res) => {
          // La contraseña se cambió exitosamente, muestra un mensaje de éxito y redirige al usuario a la página principal
          this.toastr.success(
            'Se ha actualizado la contraseña correctamente',
            'Contraseña cambiada'
          );
          this.router.navigate(['/main']);
        },
        (err) => {
          // Se produjo un error al cambiar la contraseña, muestra un mensaje de error y establece el mensaje de error personalizado
          this.toastr.error(
            '¡Ha habido un error al cambiar las contraseñas!',
            'Error'
          );
          this.errorMessage = err.error.errors[0].msg;
        }
      );
  }

  passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
  ): { [key: string]: any } | null => {
    // Validador personalizado para verificar si las contraseñas coinciden
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      // Si las contraseñas no coinciden, se devuelve un objeto con la clave 'passwordMismatch' para indicar el error
      return { passwordMismatch: true };
    }

    // Si las contraseñas coinciden, se devuelve null para indicar que no hay errores
    return null;
  };
}
