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

  signUp(user: {}) {
    return this.http.post<any>(this.URL + '/signup', user);
  }

  signIn(user: User) {
    return this.http.post<any>(this.URL + '/signin', user);
  }

  loggedIn() {
    return !!localStorage.getItem('token');
  }

  getToken() {
    return localStorage.getItem('token');
  }

  logOut() {
    localStorage.removeItem('token');
    this.router.navigate(['/signin']);
  }

  getUser(): any {
    // obtiene el token JWT del almacenamiento local
    const token = this.getToken();

    // verifica si el token es nulo o vacío
    if (!token) {
      // si el token no existe, devuelve null o realiza alguna otra acción
      return null;
    }

    // decodifica el token JWT para obtener la información del usuario
    const decodedToken: any = jwt_decode(token);
    console.log(decodedToken);

    // devuelve el id del usuario si está disponible en el token
    return decodedToken._id || null;
  }
}
