import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Evento } from '../../../interfaces/evento';
import { EventoService } from '../../../service/evento.service';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JuegoService } from '../../../service/juego.service';

@Component({
  selector: 'app-mis-eventos',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './mis-eventos.component.html',
  styleUrl: './mis-eventos.component.css'
})
export class MisEventosComponent implements OnInit {
  token: string | null = sessionStorage.getItem("token");

  public eventos: Evento[] = [];
  misEventos: Evento[] = [];
  searchQuery: string = '';

  nombreUsuario!: any;
  rol!: string | null;

  juego!: any;

  constructor(
    private eventoService: EventoService,
    private juegoService: JuegoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;

      this.eventoService.getAllEvento().subscribe(
        (eventos: Evento[]) => {
          this.eventos = eventos.filter(e => e.usuario.username === this.nombreUsuario);
          this.misEventos = [...this.eventos];
        },
        error => {
          console.error('Error cargando eventos:', error);
        }
      );
    }
  }

  findEventosByJuego(juegoId: number) {
    this.eventoService.getEventosPorJuego(juegoId).subscribe(
      result => {
        this.eventos = result;

        this.misEventos = this.eventos.filter(evento => evento.usuario.username === this.nombreUsuario);
      },
      error => {
        console.error('No hay eventos para este juego:', error);
      }
    );
  }

  filterEventos(): void {
    if (this.searchQuery) {
      this.misEventos = this.eventos.filter(evento =>
        evento.juego?.nombre.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.misEventos = [...this.eventos];
    }
  }

  contarJugadores(evento: Evento): number {
    const solicitudesAceptadas = Array.from(evento.solicitudes || []).filter(s => s.estado.toString() === 'ACEPTADA');
    return 1 + solicitudesAceptadas.length; // 1 por el creador
  }

  estaLleno(evento: Evento): boolean {
    return this.contarJugadores(evento) >= evento.num_jugadores;
  }

}
