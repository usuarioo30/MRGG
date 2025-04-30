import { Component, OnInit } from '@angular/core';
import { Evento } from '../../../interfaces/evento';
import { Usuario } from '../../../interfaces/usuario';
import { EventoService } from '../../../service/evento.service';
import { ActorService } from '../../../service/actor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-eventos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-eventos.component.html',
  styleUrl: './list-eventos.component.css'
})
export class ListEventosComponent implements OnInit {

  token: string | null = sessionStorage.getItem("token");

  public eventos: Evento[] = [];
  rol!: string | null;
  userLogin!: Usuario;
  private juegoId: number = 0;
  nombreUsuario!: any;

  constructor(
    private eventoService: EventoService,
    private actorService: ActorService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.juegoId = +params['id'];
      this.findEventosByJuego(this.juegoId);
    });
  }

  findEventosByJuego(juegoId: number) {
    this.eventoService.getEventosPorJuego(juegoId).subscribe(
      result => {
        this.eventos = result;
      },
      error => {
        console.error('Error al obtener los eventos:');
      }
    );
  }
}
