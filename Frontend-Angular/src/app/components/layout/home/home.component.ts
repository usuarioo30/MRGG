import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { JuegoService } from '../../../service/juego.service';
import { jwtDecode } from 'jwt-decode';
import { Juego } from '../../../interfaces/juego';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { EventoService } from '../../../service/evento.service';
import Swal from 'sweetalert2';

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
  public juegosSandbox: Juego[] = [];
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
    this.loadJuegosByCategoria('SANDBOX');
  }

  todosLosJuegosVacios(): boolean {
    return this.juegosDeportivos.length === 0 &&
      this.juegosShooter.length === 0 &&
      this.juegosCarreras.length === 0 &&
      this.juegosLucha.length === 0 &&
      this.juegosSurvival.length === 0 &&
      this.juegosSandbox.length === 0;
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
        } else if (categoria === 'SANDBOX') {
          this.juegosSandbox = result;
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

    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el juego permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.juegoService.deleteJuego(id).subscribe(
          () => {
            Swal.fire({
              title: 'Eliminado',
              text: 'El juego ha sido eliminado correctamente',
              icon: 'success',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              window.location.reload();
            });
          },
          (error) => {
            console.error('Error al eliminar el juego', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el juego'
            });
          }
        );
      }
    });
  }

}