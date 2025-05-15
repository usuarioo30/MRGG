import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Solicitud } from '../interfaces/solicitud';
import { Usuario } from '../interfaces/usuario';

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

  // getSolicitudDeUser(): Observable<Usuario> {
  //   const url = `${this.urlApi}/deUsuarioRecibe`;
  //   return this.http.get<Usuario>(url);
  // }

  getOneSolicitud(id: number): Observable<Solicitud> {
    const url = `${this.urlApi}/${id}`;
    return this.http.get<Solicitud>(url);
  }

  saveSolicitud(idAyto: number): Observable<void> {
    const url = `${this.urlApi}/create/${idAyto}`;
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
