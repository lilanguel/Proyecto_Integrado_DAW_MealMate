import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user.interface';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public errorMessage!: string;
  userForm: FormGroup;

  ngOnInit() {}

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService
  ) {
    this.userForm = this.fb.group({
      nombre_usuario: ['', [Validators.required]],
      email: ['', Validators.required],
      sexo: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      password: ['', Validators.required],
      peso: ['', Validators.required],
      altura: ['', [Validators.required]],
    });
  }

  signUp() {
    const usuario: User = {
      _id: '',
      nombre_usuario: this.userForm.value.nombre_usuario,
      email: this.userForm.value.email,
      sexo: this.userForm.value.sexo,
      fecha_nacimiento: this.userForm.value.fecha_nacimiento,
      password: this.userForm.value.password,
      peso: this.userForm.value.peso,
      altura: this.userForm.value.altura,
    };

    this.authService.signUp(usuario).subscribe(
      (res) => {
        this.toastr.success(
          'Se ha enviado un email a tu dirección para verificar la cuenta',
          'Usuario registrado'
        );
        this.router.navigate(['/signin']);
      },
      (err) => {
        this.toastr.error(
          'Comprueba los requisitos de los campos introducidos',
          'Error'
        );
        this.errorMessage = err.error.errors[0].msg;
      }
    );
  }
}
