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
    return this.http.get(`${this.apiUrl}/generar-rutina/${id}`);
  }
}
