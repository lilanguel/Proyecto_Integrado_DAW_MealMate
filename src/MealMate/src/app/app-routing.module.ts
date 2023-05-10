import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//Components
import {MainComponent} from './components/main/main.component'
import {SignupComponent} from './components/signup/signup.component'
import {SigninComponent} from './components/signin/signin.component'

import { AuthGuard } from './auth.guard';
import { ObjetivoComponent } from './components/objetivo/objetivo.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/main',
    pathMatch: 'full'
  },
  {
    path:'main',
    component:MainComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'objetivo',
    component:ObjetivoComponent,
    canActivate:[AuthGuard]
  },
  {
    path:'signup',
    component:SignupComponent
  },
  {
    path:'signin',
    component:SigninComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
