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
    return this.http.get(`${this.apiUrl}/users/${id}`);
  }

  getRutina(id: string, dia: string) {
    return this.http.get(`${this.apiUrl}/users/${id}/rutina/${dia}`);
  }

  updateUser(user: User) {
    return this.http.put(`${this.apiUrl}/users/${user._id}`, user);
  }
}
