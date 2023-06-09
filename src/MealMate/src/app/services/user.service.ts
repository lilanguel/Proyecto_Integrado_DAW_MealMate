import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';
import { User } from '../interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUser(id: string): Observable<any> {
    // Realiza una solicitud HTTP GET al servidor para obtener los detalles de un usuario con el ID proporcionado
    return this.http.get(`${this.apiUrl}users/${id}`);
  }

  getRutina(id: string, dia: string) {
    // Realiza una solicitud HTTP GET al servidor para obtener una rutina para un usuario específico y un día específico
    return this.http.get(`${this.apiUrl}users/${id}/rutina/${dia}`);
  }

  updateUser(user: User) {
    // Realiza una solicitud HTTP PUT al servidor para actualizar los detalles de un usuario
    return this.http.put(`${this.apiUrl}users/${user._id}`, user);
  }

  cambiarContrasena(id: string, contrasenas: Object) {
    // Realiza una solicitud HTTP PUT al servidor para cambiar la contraseña de un usuario con el ID proporcionado
    return this.http.put(
      `${this.apiUrl}users/${id}/cambiar-password`,
      contrasenas
    );
  }
}
