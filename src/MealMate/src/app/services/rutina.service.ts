import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RutinaService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  generarRutina(id: string) {
    // Realiza una solicitud HTTP GET al servidor para generar una rutina específica para un usuario con el ID proporcionado
    return this.http.get(`${this.apiUrl}generar-rutina/${id}`);
  }
}
