import { HttpClient } from '@angular/common/http';
import { Injectable, provideExperimentalCheckNoChangesForDebug } from '@angular/core';
import { Observable } from 'rxjs';
import { Evento } from '../interfaces/evento';

@Injectable({
  providedIn: 'root'
})
export class EventoService {

  constructor(private http: HttpClient) { }

  private urlApi = "http://localhost:8080/evento"

  getCantidadEventosPorJuego(juegoId: number): Observable<number> {
    return this.http.get<number>(`${this.urlApi}/cantidad/${juegoId}`);
  }

  getEventoPorId(id: number): Observable<Evento> {
    const url = `${this.urlApi}/${id}`;
    return this.http.get<Evento>(url);
  }

  getEventosPorJuego(juegoId: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.urlApi}/porJuego/${juegoId}`);
  }

  getAllEvento(): Observable<Evento[]> {
    return this.http.get<Evento[]>(this.urlApi);
  }

  getEventosBySolicitud(id: number): Observable<Evento> {
    const url = `${this.urlApi}/porSolicitud/${id}`;
    return this.http.get<Evento>(url);
  }

  saveEvento(evento: Evento): Observable<void> {
    return this.http.post<void>(this.urlApi, evento);
  }

  saveEventoPorJuego(juegoId: number, evento: Evento): Observable<void> {
    return this.http.post<void>(`${this.urlApi}/crear/${juegoId}`, evento);
  }

  editEvento(id: number, evento: Evento): Observable<void> {
    return this.http.put<void>(`${this.urlApi}/${id}`, evento);
  }

  cancelarEvento(id: number): Observable<void> {
    const url = `${this.urlApi}/cancelar/${id}`;
    return this.http.put<void>(url, null);
  }


  deleteEvento(id: number): Observable<void> {
    const url = `${this.urlApi}/${id}`
    return this.http.delete<void>(url)
  }

  unirseAlEvento(eventoId: number) {
    return this.http.post(`/api/eventos/${eventoId}/unirse`, {});
  }

}
