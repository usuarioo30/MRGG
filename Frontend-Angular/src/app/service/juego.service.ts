import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Juego } from '../interfaces/juego';

@Injectable({
  providedIn: 'root'
})
export class JuegoService {

  constructor(private http: HttpClient) { }

  private urlApi = 'http://localhost:8080/juego';

  getAllJuegosPorCategoria(categoria: string): Observable<Juego[]> {
    const url = `${this.urlApi}/categoria?categoria=${categoria}`;
    return this.http.get<Juego[]>(url);
  }

  getOneJuego(id: number) {
    const url = `${this.urlApi}/${id}`;
    return this.http.get<Juego>(url);
  }

  saveJuego(juego: Juego): Observable<Juego> {
    return this.http.post<Juego>(this.urlApi, juego);
  }

  editJuego(id: number, juego: Juego): Observable<Juego> {
    const url = `${this.urlApi}/${id}`;
    return this.http.put<Juego>(url, juego);
  }

  deleteJuego(id: number): Observable<void> {
    const url = `${this.urlApi}/${id}`;
    return this.http.delete<void>(url);
  }

}
