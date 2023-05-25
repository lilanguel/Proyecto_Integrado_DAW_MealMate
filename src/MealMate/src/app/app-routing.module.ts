import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Helpers
import { AuthGuard } from './helpers/auth.guard';

//Components
import { MainComponent } from './views/main/main.component';
import { ObjetivoComponent } from './views/objetivo/objetivo.component';
import { RutinaComponent } from './views/rutina/rutina.component';
import { SignupComponent } from './views/signup/signup.component';
import { SigninComponent } from './views/signin/signin.component';
import { DietaComponent } from './views/dieta/dieta.component';
import { RecuperarContrasenaComponent } from './views/recuperar-contrasena/recuperar-contrasena.component';
import { EditarPerfilComponent } from './views/editar-perfil/editar-perfil.component';
import { CambiarContrasenaComponent } from './views/cambiar-contrasena/cambiar-contrasena.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full',
  },
  {
    path: 'main',
    component: MainComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'objetivo',
    component: ObjetivoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'rutina/:dia',
    component: RutinaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'signup',
    component: SignupComponent,
  },
  {
    path: 'signin',
    component: SigninComponent,
  },
  {
    path: 'recuperar-contrasena',
    component: RecuperarContrasenaComponent,
  },
  {
    path: 'dieta',
    component: DietaComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'editar-perfil',
    component: EditarPerfilComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'cambiar-contraseña',
    component: CambiarContrasenaComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
