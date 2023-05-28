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
    return this.http.get(`${this.apiUrl}generar-dietas/${id}`);
  }

  obtenerDietas(id: string) {
    return this.http.get(`${this.apiUrl}users/${id}/dietas`);
  }
}
