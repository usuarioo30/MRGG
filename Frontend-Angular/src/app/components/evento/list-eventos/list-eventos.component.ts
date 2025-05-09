import { Component, OnInit } from '@angular/core';
import { Evento } from '../../../interfaces/evento';
import { Usuario } from '../../../interfaces/usuario';
import { EventoService } from '../../../service/evento.service';
import { ActorService } from '../../../service/actor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadoEvento } from '../../../interfaces/estado-evento';
import { JuegoService } from '../../../service/juego.service';

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
  public eventoForm!: FormGroup;
  private juegoId: number = 0;
  nombreUsuario!: any;
  public juego: any;

  mostrarToastFlag: boolean = false;

  constructor(
    private eventoService: EventoService,
    private juegoService: JuegoService,
    private fb: FormBuilder,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }

    this.eventoForm = this.fb.group({
      codigo_sala: ['0', Validators.required],
      num_usuario: ['0', Validators.required],
      fecha_inicio: [new Date(), Validators.required],
      descripcion: ['', Validators.required],
      num_jugadores: [0, [Validators.required, Validators.min(2)]],
    });
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.juegoId = +params['id'];
      this.findJuegoById(this.juegoId);
      this.findEventosByJuego(this.juegoId);
    });
  }

  findJuegoById(juegoId: number) {
    this.juegoService.getOneJuego(juegoId).subscribe(
      (juego) => {
        this.juego = juego;
      },
      (error) => {
        console.error('Error al obtener el juego:', error);
        if (error.status === 404) {
          alert('Juego no encontrado');
          this.router.navigate(['/']);
        }
      }
    );
  }

  findEventosByJuego(juegoId: number) {
    this.eventoService.getEventosPorJuego(juegoId).subscribe(
      result => {
        this.eventos = result;
      },
      error => {
        console.error('No hay eventos para este juego:', error);
      }
    );
  }

  saveEvento() {
    if (this.eventoForm.valid) {
      const eventoAEnviar: Evento = this.eventoForm.value;

      this.eventoService.saveEventoPorJuego(this.juegoId, eventoAEnviar).subscribe(
        () => {
          this.findEventosByJuego(this.juegoId);
          this.router.navigate(['/juego', this.juegoId, 'eventos']);
          window.location.reload();
        },
        error => {
          console.error('Error al crear el evento:', error);
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }

  // unirseAlEvento(evento: Evento): void {
  //   console.log('Unirse al evento con ID:', evento.id);
  
  //   this.eventoService.unirseAlEvento(evento.id).subscribe(
  //     response => {
  //       console.log('Unido al evento correctamente:', response);
  //       this.findEventosByJuego(this.juegoId);
  //     },
  //     error => {
  //       console.error('Error al unirse al evento:', error);
  //       alert('No se pudo unir al evento. Posiblemente ya estés unido o el evento está lleno.');
  //     }
  //   );
  // }
  

  copiarCodigo(codigo: string): void {
    navigator.clipboard.writeText(codigo).then(() => {
      this.mostrarToastFlag = true;
      this.mostrarToast();
    }).catch(err => {
      console.error('Error al copiar el código:', err);
    });
  }

  mostrarToast(): void {
    setTimeout(() => {
      this.mostrarToastFlag = false
    }, 2000);
  }
}
