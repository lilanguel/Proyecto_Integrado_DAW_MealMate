import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode';
import { environment } from '../environments/environment';
import { User } from '../interfaces/user.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private URL = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router) {}

  signUp(user: User) {
    // Realiza una solicitud HTTP POST al servidor para registrar un nuevo usuario
    return this.http.post<any>(this.URL + 'signup', user);
  }

  signIn(user: User) {
    // Realiza una solicitud HTTP POST al servidor para iniciar sesión con las credenciales del usuario
    return this.http.post<any>(this.URL + 'signin', user);
  }

  loggedIn() {
    // Verifica si el token está presente en el almacenamiento local y devuelve un valor booleano
    return !!localStorage.getItem('token');
  }

  getToken() {
    // Obtiene el token del almacenamiento local
    return localStorage.getItem('token');
  }

  logOut() {
    // Elimina el token del almacenamiento local y redirige al usuario a la página de inicio de sesión
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }

  getUser(): any {
    // Obtiene el token JWT del almacenamiento local
    const token = this.getToken();

    // Verifica si el token es nulo o vacío
    if (!token) {
      // Si el token no existe, devuelve null 
      return null;
    }

    // Decodifica el token JWT para obtener la información del usuario
    const decodedToken: any = jwt_decode(token);

    // Devuelve el id del usuario si está disponible en el token
    return decodedToken._id || null;
  }
}
