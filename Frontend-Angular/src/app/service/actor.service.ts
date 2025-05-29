import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActorLogin } from '../interfaces/actor-login';

@Injectable({
  providedIn: 'root'
})
export class ActorService {

  constructor(private http: HttpClient) { }

  // URL API Backend

  private urlAPI = "http://localhost:8080"

  private urlApi = "http://localhost:8080/actor"

  login(actorLogin: ActorLogin): Observable<any> {
    return this.http.post<any>(`${this.urlAPI}/login`, actorLogin);
  }

  actorLogueado(): Observable<any> {
    return this.http.get<any>(`${this.urlAPI}/actorLogueado`);
  }

  actorExist(username: string): Observable<any> {
    return this.http.get<any>(`${this.urlAPI}/actorExiste/${username}`);
  }

  actorExistEmail(email: string): Observable<any> {
    return this.http.get<any>(`${this.urlAPI}/actorExisteEmail/${email}`);
  }

  mandarCorreoParaRecuperarContrasena(email: string) {
    const url = `${this.urlApi}/enviarEmailParaRecuperarContrasena`;
    return this.http.put<void>(url, email);
  }

  recuperarContrasena(contrasena: string, claveSegura: string) {
    const url = `${this.urlApi}/recuperarContrasena/${claveSegura}`;
    return this.http.put<void>(url, contrasena);
  }

  updateContrasena(contrasena: string) {
    const url = `${this.urlApi}/updateContrasena`;
    return this.http.put<void>(url, contrasena);
  }
}
