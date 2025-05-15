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
import { UsuarioService } from '../../../service/usuario.service';

@Component({
  selector: 'app-list-eventos',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './list-eventos.component.html',
  styleUrl: './list-eventos.component.css'
})
export class ListEventosComponent implements OnInit {

  token: string | null = sessionStorage.getItem("token");

  public eventos: Evento[] = [];
  misEventos: Evento[] = [];
  otrosEventos: Evento[] = [];
  rol!: string | null;
  userLogin!: Usuario;
  public eventoForm!: FormGroup;
  private juegoId: number = 0;
  nombreUsuario!: any;
  public juego: any;
  minFechaInicio: string = '';
  eventoSeleccionado!: Evento;


  mostrarToastFlag: boolean = false;

  constructor(
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
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
    this.minFechaInicio = this.getMinFechaInicio();

    // Siempre obtenemos el ID del juego y cargamos la información del juego
    this.activatedRoute.params.subscribe(params => {
      this.juegoId = +params['id'];
      this.findJuegoById(this.juegoId); // Mostrar carátula SIEMPRE
    });

    if (this.token) {
      this.usuarioService.getOneUsuarioLogin().subscribe({
        next: (usuario) => {
          this.userLogin = usuario;
          this.nombreUsuario = usuario.username; // Usa esto mejor que el token

          const isBaneado = usuario.baneado;

          if (!isBaneado) {
            this.findEventosByJuego(this.juegoId);
          }
          // Si está baneado, no cargamos eventos
        },
        error: (err) => {
          console.error('Error al cargar el usuario:', err);
          // Si ocurre un error, como token inválido, aún así carga los eventos de forma anónima
          this.findEventosByJuego(this.juegoId);
        }
      });
    } else {
      // Usuario no logueado => cargar eventos igualmente
      this.findEventosByJuego(this.juegoId);
    }
  }




  getMinFechaInicio(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
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

        // Clasifica los eventos
        this.misEventos = this.eventos.filter(evento => evento.usuario.username === this.nombreUsuario);
        this.otrosEventos = this.eventos.filter(evento => evento.usuario.username !== this.nombreUsuario);
      },
      error => {
        console.error('No hay eventos para este juego:', error);
      }
    );
  }

  saveEvento() {
    if (this.eventoForm.valid) {
      const eventoAEnviar: Evento = this.eventoForm.value;
      const fechaInicioSeleccionada = new Date(eventoAEnviar.fecha_inicio);

      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      fechaInicioSeleccionada.setHours(0, 0, 0, 0);

      if (fechaInicioSeleccionada < hoy) {
        alert("La fecha de inicio no puede ser anterior a hoy.");
        return;
      }

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

  abrirModalCrear() {
    this.eventoSeleccionado = undefined!;
    this.eventoForm.reset({
      codigo_sala: '0',
      num_usuario: '0',
      fecha_inicio: this.getMinFechaInicio(),
      descripcion: '',
      num_jugadores: 2
    });
  }

  abrirModalEditar(evento: Evento) {
    this.eventoSeleccionado = evento;

    this.eventoForm.patchValue({
      num_jugadores: evento.num_jugadores,
      descripcion: evento.descripcion,
      fecha_inicio: new Date(evento.fecha_inicio).toISOString().substring(0, 10),
    });
  }

  editarEvento() {
    if (this.eventoForm.valid && this.eventoSeleccionado) {
      const eventoActualizado: Evento = this.eventoForm.value;

      this.eventoService.editEvento(this.eventoSeleccionado.id!, eventoActualizado).subscribe(
        () => {
          this.findEventosByJuego(this.juegoId);
          this.eventoSeleccionado = undefined!;
          window.location.reload();
        },
        error => {
          console.error("Error al editar el evento:", error);
        }
      );
    }
  }

  eliminarEvento(id: number) {
    var confirmacion = window.confirm("¿Estas seguro de eliminar el evento?");
    if (confirmacion) {
      this.eventoService.deleteEvento(id).subscribe(
        result => {
          this.findEventosByJuego(this.juegoId);
          window.location.reload();
        },
        error => { console.log(error.status) }
      );
    }
  }

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
