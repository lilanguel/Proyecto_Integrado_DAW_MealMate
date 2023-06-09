import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ObjetivoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  seleccionarObjetivo(id: number, objetivo: string) {
    // Realiza una solicitud HTTP PUT al servidor para seleccionar un objetivo para un ID específico
    return this.http.put(`${this.apiUrl}objetivo/${id}`, {
      objetivo: objetivo,
    });
  }
}
