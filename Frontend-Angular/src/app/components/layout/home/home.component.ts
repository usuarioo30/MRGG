import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JuegoService } from '../../../service/juego.service';
import { jwtDecode } from 'jwt-decode';
import { Juego } from '../../../interfaces/juego';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EventoService } from '../../../service/evento.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public juegos: Juego[] = [];
  public contadorEventos: { [juegoId: number]: number } = {};

  token: string | null = sessionStorage.getItem("token");
  nombre: any;
  rol!: string;

  constructor(
    private router: Router,
    private juegoService: JuegoService,
    private eventoService: EventoService
  ) {
    if (this.token) {
      this.nombre = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    this.findAllJuegos();
  }

  findAllJuegos() {
    this.juegoService.getAllJuegos().subscribe(
      result => {
        this.juegos = result;

        this.juegos.forEach(juego => {
          this.eventoService.getCantidadEventosPorJuego(juego.id).subscribe(
            count => this.contadorEventos[juego.id] = count,
            error => this.contadorEventos[juego.id] = 0
          );
        });
      },
      error => { console.log(error); }
    );
  }
}
