import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitud } from '../interfaces/solicitud';
import { Usuario } from '../interfaces/usuario';
import { Evento } from '../interfaces/evento';

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {

  constructor(private http: HttpClient) { }

  private urlApi = 'http://localhost:8080/solicitud';

  getAllSolicitudByEvento(id: number): Observable<Solicitud[]> {
    const url = `${this.urlApi}/delEvento/${id}`;
    return this.http.get<Solicitud[]>(url);
  }

  getAllSolicitudByUsuario(): Observable<Set<Solicitud>> {
    const url = `${this.urlApi}/deUsuario`;
    return this.http.get<Set<Solicitud>>(url);
  }

  getOneSolicitud(id: number): Observable<Solicitud> {
    const url = `${this.urlApi}/${id}`;
    return this.http.get<Solicitud>(url);
  }

  getAllSolicitudesByUsuario(): Observable<Solicitud[]> {
    const url = `${this.urlApi}/misSolicitudes`;
    return this.http.get<Solicitud[]>(url);
  }

  saveSolicitud(idEvento: number): Observable<void> {
    const url = `${this.urlApi}/create/${idEvento}`;
    return this.http.get<void>(url);
  }

  deleteSolicitud(id: number): Observable<void> {
    const url = `${this.urlApi}/${id}`;
    return this.http.delete<void>(url);
  }

  acceptSolicitud(id: number): Observable<Solicitud> {
    const url = `${this.urlApi}/accept/${id}`;
    return this.http.get<Solicitud>(url);
  }

  refuseSolicitud(id: number): Observable<Solicitud> {
    const url = `${this.urlApi}/refuse/${id}`;
    return this.http.get<Solicitud>(url);
  }

}
