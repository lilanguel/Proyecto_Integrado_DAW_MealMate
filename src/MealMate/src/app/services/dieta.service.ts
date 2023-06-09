import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DietaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  generarDieta(id: string) {
    // Realiza una solicitud HTTP GET al servidor para generar una dieta específica para un usuario con el ID proporcionado
    return this.http.get(`${this.apiUrl}generar-dietas/${id}`);
  }

  obtenerDietas(id: string) {
    // Realiza una solicitud HTTP GET al servidor para obtener las dietas asociadas a un usuario con el ID proporcionado
    return this.http.get(`${this.apiUrl}users/${id}/dietas`);
  }
}
