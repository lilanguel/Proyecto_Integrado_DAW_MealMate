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
    this.passwordForm = this.fb.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
      },
      { validator: this.passwordMatchValidator }
    );
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();
  }

  cambiarContrasena() {
    this.userService
      .cambiarContrasena(this.user, this.passwordForm.value)
      .subscribe(
        (res) => {
          this.toastr.success(
            'Se ha actualizado la contraseña correctamente',
            'Contraseña cambiada'
          );
          this.router.navigate(['/main']);
        },
        (err) => {
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
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (
      password &&
      confirmPassword &&
      password.value !== confirmPassword.value
    ) {
      return { passwordMismatch: true };
    }

    return null;
  };
}
