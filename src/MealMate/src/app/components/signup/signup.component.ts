import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
})
export class SignupComponent implements OnInit {
  public errorMessage!: string;

  userForm: FormGroup;

  user = {
    nombre_usuario: '',
    email: '',
    sexo: '',
    fecha_nacimiento: '',
    password: '',
    peso: '',
    altura: '',
  };

  ngOnInit() {}

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      nombre_usuario: ['', Validators.required],
      email: ['', Validators.required],
      sexo: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      password: ['', Validators.required],
      peso: ['', Validators.required],
      altura: ['', Validators.required],
    });
  }

  signUp() {
    this.authService.signUp(this.user).subscribe(
      (res) => {
        console.log(res);
        localStorage.setItem('token', res.token);
        this.router.navigate(['/main']);
      },
      (err) => {
        console.log(err);
        this.errorMessage = err.error;
      }
    );
  }
}
