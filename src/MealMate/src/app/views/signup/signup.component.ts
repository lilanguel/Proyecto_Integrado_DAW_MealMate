import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/interfaces/user.interface';

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
    private fb: FormBuilder
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
        console.log(res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/main']);
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.error.errors[0].msg;
      }
    );
  }
}
