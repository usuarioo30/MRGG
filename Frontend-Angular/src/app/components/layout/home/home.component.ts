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
  public juegosDeportivos: Juego[] = [];
  public juegosShooter: Juego[] = [];
  public juegosCarreras: Juego[] = [];
  public juegosLucha: Juego[] = [];
  public juegosSurvival: Juego[] = [];
  public contadorEventos: { [juegoId: number]: number } = {};

  token: string | null = sessionStorage.getItem('token');
  nombre: string | undefined;
  rol: string | undefined;

  constructor(
    private router: Router,
    private juegoService: JuegoService,
    private eventoService: EventoService
  ) {
    if (this.token !== null && this.token) {
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    this.loadJuegosByCategoria('DEPORTES');
    this.loadJuegosByCategoria('SHOOTER');
    this.loadJuegosByCategoria('CARRERAS');
    this.loadJuegosByCategoria('LUCHA');
    this.loadJuegosByCategoria('SURVIVAL');
  }

  loadJuegosByCategoria(categoria: string): void {
    this.juegoService.getAllJuegosPorCategoria(categoria).subscribe(
      (result: Juego[]) => {
        if (categoria === 'DEPORTES') {
          this.juegosDeportivos = result;
        } else if (categoria === 'SHOOTER') {
          this.juegosShooter = result;
        } else if (categoria === 'CARRERAS') {
          this.juegosCarreras = result;
        } else if (categoria === 'LUCHA') {
          this.juegosLucha = result;
        } else if (categoria === 'SURVIVAL') {
          this.juegosSurvival = result;
        }

        result.forEach(juego => {
          this.eventoService.getCantidadEventosPorJuego(juego.id).subscribe(
            (count: number) => {
              this.contadorEventos[juego.id] = count;
            },
            (error) => {
              console.error('Error al obtener la cantidad de eventos', error);
              this.contadorEventos[juego.id] = 0;
            }
          );
        });
      },
      (error) => {
        console.error('Error al obtener los juegos', error);
      }
    );
  }

  deleteJuego(id: number, event: MouseEvent): void {
    event.stopPropagation();

    this.juegoService.deleteJuego(id).subscribe(
      () => {
        window.location.reload();
        this.loadJuegosByCategoria('DEPORTES');
        this.loadJuegosByCategoria('SHOOTER');
        this.loadJuegosByCategoria('CARRERAS');
        this.loadJuegosByCategoria('LUCHA');
        this.loadJuegosByCategoria('SURVIVAL');
      },
      (error) => {
        console.error('Error al eliminar el juego', error);
      }
    );
  }

}
