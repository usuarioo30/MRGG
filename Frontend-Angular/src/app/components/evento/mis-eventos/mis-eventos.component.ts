import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Evento } from '../../../interfaces/evento';
import { EventoService } from '../../../service/evento.service';
import { Router, RouterLink } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { JuegoService } from '../../../service/juego.service';
import { UsuarioService } from '../../../service/usuario.service';

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
  baneado: boolean = false;

  juego!: any;

  constructor(
    private eventoService: EventoService,
    private juegoService: JuegoService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.token) {
      const decodedToken: any = jwtDecode(this.token);
      this.nombreUsuario = decodedToken.sub;
      this.rol = decodedToken.rol;

      this.usuarioService.getOneUsuarioLogin().subscribe({
        next: (usuario) => {
          this.baneado = usuario.baneado;
          if (!this.baneado) {
            this.cargarEventos();
          }
        },
        error: (err) => {
          console.error('Error al cargar usuario:', err);
          this.cargarEventos();
        }
      });
    }
  }

  cargarEventos(): void {
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
    const query = this.searchQuery.toLowerCase();
    this.misEventos = this.eventos.filter(evento =>
      evento.juego?.nombre.toLowerCase().includes(query) ||
      evento.codigo_sala.toLowerCase().includes(query)
    );
  }

  contarJugadores(evento: Evento): number {
    const solicitudesAceptadas = Array.from(evento.solicitudes || []).filter(s => s.estado.toString() === 'ACEPTADA');
    return 1 + solicitudesAceptadas.length; // 1 por el creador
  }

  contarSolicitudes(evento: Evento): number {
    return evento.solicitudes
      ? evento.solicitudes.filter(s => s.estado.toString() === 'PENDIENTE').length
      : 0;
  }


  estaLleno(evento: Evento): boolean {
    return this.contarJugadores(evento) >= evento.num_jugadores;
  }

}
