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
  private idUsuario!: number;

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

  getUsuarioId(): number {
    return this.idUsuario;
  }

  saveUsuario(usuario: Actor): Observable<Actor> {
    return this.http.post<Actor>(this.urlApi, usuario);
  }

  editUsuario(usuario: Actor): Observable<Actor> {
    const url = `${this.urlApi}`;
    return this.http.put<Actor>(url, usuario);
  }

  deleteUsuario(): Observable<Actor> {
    const url = `${this.urlApi}`;
    return this.http.delete<Actor>(url);
  }

  updateContrasena(contrasena: string) {
    const url = `${this.urlApi}/updateContrasena`;
    return this.http.put<void>(url, contrasena);
  }

  cambiarEstadoBaneo(id: number, baneado: boolean): Observable<any> {
    const url = `${this.urlApi}/${id}/banear`;
    return this.http.put(url, { baneado: baneado });
  }

}
