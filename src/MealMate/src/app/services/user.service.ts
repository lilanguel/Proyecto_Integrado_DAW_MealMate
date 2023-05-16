import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getUser(id: string) {
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  getRutina(id: string, dia: string) {
    return this.http.get(`${this.apiUrl}/users/${id}/rutina/${dia}`);
  }
}
