import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './helpers/auth.guard';
import { TokenInterceptorService } from './interceptors/token-interceptor.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { DietaComponent } from './views/dieta/dieta.component';
import { SignupComponent } from './views/signup/signup.component';
import { SigninComponent } from './views/signin/signin.component';
import { MainComponent } from './views/main/main.component';
import { ObjetivoComponent } from './views/objetivo/objetivo.component';
import { RutinaComponent } from './views/rutina/rutina.component';
import { SpinnerModule } from './shared/spinner/spinner.module';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { RecuperarContrasenaComponent } from './views/recuperar-contrasena/recuperar-contrasena.component';
import { EditarPerfilComponent } from './views/editar-perfil/editar-perfil.component';

@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    SigninComponent,
    MainComponent,
    ObjetivoComponent,
    RutinaComponent,
    DietaComponent,
    RecuperarContrasenaComponent,
    EditarPerfilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    SpinnerModule,
  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
