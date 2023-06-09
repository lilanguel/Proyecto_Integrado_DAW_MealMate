import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css'],
})
export class SigninComponent {
  public errorMessage!: string;
  userForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    // Crea un formulario reactivo para el inicio de sesión con validaciones
    this.userForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  signIn() {
    // Realiza el inicio de sesión utilizando el servicio de autenticación
    this.authService.signIn(this.userForm.value).subscribe(
      (res) => {
        // Almacena el token de acceso en el almacenamiento local (localStorage)
        localStorage.setItem('token', res.token);
        // Redirecciona al componente 'main'
        this.router.navigate(['/main']);
      },
      (err) => {
        // Muestra un mensaje de error utilizando Toastr en caso de credenciales inválidas
        this.toastr.error('¡Las credenciales no son válidas!', 'Error');
        this.errorMessage = err.error;
      }
    );
  }
}
