import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { Actor } from '../interfaces/actor';
import { HttpClient } from '@angular/common/http';
import { Usuario } from '../interfaces/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(private http: HttpClient) { }

  private urlApi = "https://mrgg.onrender.com/usuario";
  private idUsuario!: number;

  getAllUsuarios(): Observable<Actor[]> {
    return this.http.get<Actor[]>(this.urlApi);
  }

  getOneUsuario(id: number): Observable<Actor> {
    const url = `${this.urlApi}/${id}`;
    return this.http.get<Actor>(url);
  }

  getOneUsuarioLogin(): Observable<Actor> {
    const url = "https://mrgg.onrender.com/actorLogueado"
    return this.http.get<Actor>(url);
  }

  getUsuarioId(): number {
    return this.idUsuario;
  }

  getSolicitudDeUser(id: number): Observable<Usuario> {
    const url = `${this.urlApi}/solicitud/recibida/${id}`;
    return this.http.get<Usuario>(url);
  }

  getUserMensaje(id: number): Observable<Usuario> {
    const url = `${this.urlApi}/mensaje/${id}`;
    return this.http.get<Usuario>(url);
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

  activarUsuario(clavePrivada: string) {
    const url = `${this.urlApi}/verificarUsuario/${clavePrivada}`;
    return this.http.put<void>(url, clavePrivada);
  }

}
