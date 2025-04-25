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

  login(actorLogin: ActorLogin): Observable<any> {
    return this.http.post<any>(`${this.urlAPI}/login`, actorLogin);
  }

  usuarioLogueado(): Observable<any> {
    return this.http.get<any>(`${this.urlAPI}/actorLogueado`);
  }

  actorExist(username: string): Observable<any> {
    return this.http.get<any>(`${this.urlAPI}/actorExiste/${username}`);
  }
}
