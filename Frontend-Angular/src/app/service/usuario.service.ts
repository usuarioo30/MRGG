import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Actor } from '../interfaces/actor';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  private urlApi = "http://localhost:8080/usuario";

  getAllUsuarios(): Observable<Actor[]> {
    return this.http.get<Actor[]>(this.urlApi);
  }

  getOneUsuario(id: number): Observable<Actor> {
    const url = `${this.urlApi}/${id}`;
    return this.http.get<Actor>(url);
  }

  getOneUsuarioLogin(): Observable<Actor> {
    const url = "http://localhost:8080/actorLogueado";
    return this.http.get<Actor>(url);
  }

  saveUsuario(usuario: Actor): Observable<Actor> {
    return this.http.post<Actor>(this.urlApi, usuario);
  }

  editUsuario(usuario: Actor): Observable<Actor> {
    const url = `${this.urlApi}/${usuario.id}`;
    return this.http.put<Actor>(url, usuario);
  }

  deleteUsuario(id: number): Observable<Actor> {
    const url = `${this.urlApi}/${id}`;
    return this.http.delete<Actor>(url);
  }
}
