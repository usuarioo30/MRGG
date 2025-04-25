import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Juego } from '../interfaces/juego';

@Injectable({
  providedIn: 'root'
})
export class JuegoService {

  constructor(private http: HttpClient) { }

  private urlApi = 'http://localhost:8080/juego';

  getAllJuegos(): Observable<Juego[]> {
    return this.http.get<Juego[]>(this.urlApi);
  }
}
