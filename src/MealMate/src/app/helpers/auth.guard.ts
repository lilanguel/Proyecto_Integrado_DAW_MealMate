import { Injectable } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    // Verifica si el usuario ha iniciado sesión llamando al método "loggedIn" del servicio "AuthService"
    if (this.authService.loggedIn()) {
      return true; // Permite la navegación si el usuario ha iniciado sesión
    }

    // Si el usuario no ha iniciado sesión, redirige a la página de inicio de sesión ("/signin")
    this.router.navigate(['/signin']);
    return false; // No permite la navegación
  }
}
