import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MailService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  recuperarContraseña(email: string) {
    const data = {email}
    return this.http.post(`${this.apiUrl}recuperar-contrasena`, data);
  }
}
