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
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
