import { Component, OnInit } from '@angular/core';
import { Evento } from '../../../interfaces/evento';
import { Usuario } from '../../../interfaces/usuario';
import { EventoService } from '../../../service/evento.service';
import { ActorService } from '../../../service/actor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EstadoEvento } from '../../../interfaces/estado-evento';
import { JuegoService } from '../../../service/juego.service';
import { UsuarioService } from '../../../service/usuario.service';
import { SolicitudService } from '../../../service/solicitud.service';

@Component({
  selector: 'app-list-eventos',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list-eventos.component.html',
  styleUrl: './list-eventos.component.css'
})
export class ListEventosComponent implements OnInit {

  token: string | null = sessionStorage.getItem("token");

  eventos: Evento[] = [];
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

  codigoSalaFiltro: string = '';
  eventosFiltrados: Evento[] = [];
  estadoFiltro: string = '';

  mostrarToastFlag: boolean = false;

  constructor(
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private juegoService: JuegoService,
    private solicitudService: SolicitudService,
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

    this.activatedRoute.params.subscribe(params => {
      const idParam = params['id'];

      const id = Number(idParam);

      if (!id || isNaN(id) || id <= 0) {
        this.router.navigate(['/']);
      } else {
        this.juegoId = id;
        this.findJuegoById(this.juegoId);
      }
    });


    if (this.token) {
      this.usuarioService.getOneUsuarioLogin().subscribe({
        next: (usuario) => {
          this.userLogin = usuario;
          this.nombreUsuario = usuario.username;

          const isBaneado = usuario.baneado;

          if (!isBaneado) {
            this.findEventosByJuego(this.juegoId);
          }
        },
        error: (err) => {
          console.error('Error al cargar el usuario:', err);
          this.findEventosByJuego(this.juegoId);

          this.cargarEventos();
        }
      });
    } else {
      this.findEventosByJuego(this.juegoId);
      this.cargarEventos();
    }
  }

  cargarEventos() {
    this.eventoService.getAllEvento().subscribe(data => {
      this.eventos = data;
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    this.eventosFiltrados = this.eventos.filter(evento => {
      const codigo = this.codigoSalaFiltro
        ? evento.codigo_sala.toLowerCase().includes(this.codigoSalaFiltro.toLowerCase())
        : true;

      const estado = this.estadoFiltro
        ? this.obtenerEstadoEvento(evento).toUpperCase() === this.estadoFiltro.toUpperCase()
        : true;

      return codigo && estado;
    });

    this.actualizarListasFiltradas();
  }

  actualizarListasFiltradas() {
    if (this.userLogin) {
      this.misEventos = this.eventosFiltrados.filter(ev => ev.usuario.id === this.userLogin.id);
      this.otrosEventos = this.eventosFiltrados.filter(ev => ev.usuario.id !== this.userLogin.id);
    } else {
      this.misEventos = [];
      this.otrosEventos = [...this.eventosFiltrados];
    }
  }

  aplicarFiltroEstado() {
    this.aplicarFiltros();
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

        this.aplicarFiltroCodigoSala();
      },
      error => {
        console.error('No hay eventos para este juego:', error);
      }
    );
  }

  aplicarFiltroCodigoSala() {
    if (this.codigoSalaFiltro.trim() !== '') {
      this.eventosFiltrados = this.eventos.filter(evento =>
        evento.codigo_sala.toLowerCase().includes(this.codigoSalaFiltro.toLowerCase())
      );
    } else {
      this.eventosFiltrados = [...this.eventos];
    }

    this.misEventos = this.eventosFiltrados.filter(evento => evento.usuario.username === this.nombreUsuario);
    this.otrosEventos = this.eventosFiltrados.filter(evento => evento.usuario.username !== this.nombreUsuario);
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

  solicitarUnirse(eventoId: number): void {
    this.solicitudService.saveSolicitud(eventoId).subscribe({
      next: () => {
        alert('Solicitud enviada correctamente.');
        this.findEventosByJuego(this.juegoId);
      },
      error: (error) => {
        console.error('Error al enviar la solicitud:', error);
        alert('No se pudo enviar la solicitud.');
      }
    });
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

  contarJugadores(evento: Evento): number {
    return 1 + Array.from(evento.solicitudes || []).filter(s => s.estado.toString() === 'ACEPTADA').length;
  }

  estaLleno(evento: Evento): boolean {
    return this.contarJugadores(evento) >= evento.num_jugadores;
  }

  obtenerEstadoEvento(evento: Evento): string {
    return this.estaLleno(evento) ? 'CERRADO' : evento.estado.toString();
  }
}
