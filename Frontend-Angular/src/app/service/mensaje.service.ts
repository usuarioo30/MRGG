import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mensaje } from '../interfaces/mensaje';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MensajeService {

  constructor(private http: HttpClient) { }

  private urlApi = 'http://localhost:8080/mensaje';

  enviarMensajeDesdeAdmin(mensaje: Mensaje, username: string): Observable<boolean> {
    const url = `${this.urlApi}/enviar/${username}`;

    return this.http.post<boolean>(url, mensaje);
  }

  enviarMensajeDesdeUsuario(mensaje: Mensaje): Observable<boolean> {
    const url = `${this.urlApi}/enviar`;

    return this.http.post<boolean>(url, mensaje);
  }

  getMensaje(id: number): Observable<Mensaje> {
    const url = `${this.urlApi}/${id}`;

    return this.http.get<Mensaje>(url);
  }

  getMensajesUsuario(): Observable<Mensaje[]> {
    const url = `${this.urlApi}/usuario`;

    return this.http.get<Mensaje[]>(url);
  }

  getMensajesAdmin(): Observable<Mensaje[]> {
    const url = `${this.urlApi}/admin`;

    return this.http.get<Mensaje[]>(url);
  }

  marcarComoLeido(mensajeId: number): Observable<Mensaje> {
    return this.http.put<Mensaje>(`${this.urlApi}/${mensajeId}/leido`, {});
  }

}
