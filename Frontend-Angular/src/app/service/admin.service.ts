import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Actor } from '../interfaces/actor';
import { HttpClient } from '@angular/common/http';
import { Admin } from '../interfaces/admin';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  private urlApi = "http://localhost:8080/admin"

  getAllAdmins(): Observable<Actor[]> {
    return this.http.get<Actor[]>(this.urlApi);
  }

  getOneAdminLogin(): Observable<Actor> {
    const url = "http://localhost:8080/actorLogueado";
    return this.http.get<Actor>(url);
  }

  saveAdmin(admin: Admin): Observable<void> {
    return this.http.post<void>(this.urlApi, admin)
  }

  updateContrasena(contrasena: string) {
    const url = `${this.urlApi}/updateContrasena`;
    return this.http.put<void>(url, contrasena);
  }

  editAdmin(admin: Admin): Observable<void> {
    const url = `${this.urlApi}`;
    return this.http.put<void>(url, admin);
  }

  deleteAdmin(): Observable<void> {
    const url = `${this.urlApi}`;
    return this.http.delete<void>(url);
  }
}
