import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from 'src/app/interfaces/user.interface';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css'],
})
export class EditarPerfilComponent implements OnInit {
  public errorMessage!: string;
  userForm: FormGroup;
  user: any;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.userForm = this.fb.group({
      nombre_usuario: ['', [Validators.required]],
      email: ['', Validators.required],
      sexo: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      peso: ['', Validators.required],
      altura: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.user = this.authService.getUser();

    this.userService.getUser(this.user).subscribe((data) => {
      this.userForm.setValue({
        nombre_usuario: data.nombre_usuario,
        email: data.email,
        sexo: data.sexo,
        fecha_nacimiento: data.fecha_nacimiento,
        peso: data.peso,
        altura: data.altura,
      });
    });
  }

  editarPerfil() {
    const usuario: User = {
      _id: this.user,
      nombre_usuario: this.userForm.value.nombre_usuario,
      email: this.userForm.value.email,
      sexo: this.userForm.value.sexo,
      fecha_nacimiento: this.userForm.value.fecha_nacimiento,
      password: '',
      peso: this.userForm.value.peso,
      altura: this.userForm.value.altura,
    };

    this.userService.updateUser(usuario).subscribe(
      (res) => {
        this.toastr.success(
          `Se ha actualizado correctamente el perfil`,
          'Perfil actualizado'
        );
        this.router.navigate(['/main']);
      },
      (err) => {
        this.toastr.error(
          `No se ha podido actualizar el perfil correctamente`,
          'Error al editar perfil'
        );
        this.errorMessage = err.error.errors[0].msg;
      }
    );
  }
}
