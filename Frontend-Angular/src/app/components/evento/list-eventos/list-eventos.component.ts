import { Component, OnInit } from '@angular/core';
import { Evento } from '../../../interfaces/evento';
import { Usuario } from '../../../interfaces/usuario';
import { EventoService } from '../../../service/evento.service';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { JuegoService } from '../../../service/juego.service';
import { UsuarioService } from '../../../service/usuario.service';
import { SolicitudService } from '../../../service/solicitud.service';
import Swal from 'sweetalert2';

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
  nombreUsuarioFiltro: string = '';

  tieneSolicitud: boolean[] = [];

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


    this.findEventosByJuego(this.juegoId);

    if (this.token) {
      this.usuarioService.getOneUsuarioLogin().subscribe({
        next: (usuario) => {
          this.userLogin = usuario;
          this.nombreUsuario = usuario.username;

          const isBaneado = usuario.baneado;
        },
        error: (err) => {
          console.error('Error al cargar el usuario:', err);
        }
      });
    }
  }

  aplicarFiltros() {
    this.eventosFiltrados = this.eventos.filter(evento => {
      const codigo = this.codigoSalaFiltro
        ? evento.codigo_sala.toLowerCase().includes(this.codigoSalaFiltro.toLowerCase())
        : true;

      const estado = this.estadoFiltro
        ? this.obtenerEstadoEvento(evento).toUpperCase() === this.estadoFiltro.toUpperCase()
        : true;

      const usuario = this.nombreUsuarioFiltro
        ? evento.usuario.username.toLowerCase().includes(this.nombreUsuarioFiltro.toLowerCase())
        : true;

      return codigo && estado && usuario;
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
        result.forEach(r => {
          this.tieneSolicitud[r.id] = false;
          this.solicitudService.isEventoTieneSoliciutdByUser(r.id).subscribe(
            result => this.tieneSolicitud[r.id] = result,
            error => console.error('Error al cargar las solicitudes:', error)
          )
        });
        console.log(this.tieneSolicitud);
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
    Swal.fire({
      title: '¿Quieres unirte a este evento?',
      text: 'Se enviará una solicitud al organizador para unirte.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar solicitud',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.solicitudService.saveSolicitud(eventoId).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: '¡Solicitud enviada!',
              text: 'Tu solicitud fue enviada correctamente.',
              confirmButtonText: 'OK'
            });
            this.findEventosByJuego(this.juegoId);
          },
          error: (error) => {
            console.error('Error al enviar la solicitud:', error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo enviar la solicitud.',
            });
          }
        });
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

  cancelarEvento(id: number) {
    Swal.fire({
      title: '¿Estás seguro de cancelar el evento?',
      text: 'El evento cambiará a estado CANCELADO y no podrá unirse nadie más.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cancelar',
      cancelButtonText: 'No'
    }).then(result => {
      if (result.isConfirmed) {
        this.eventoService.cancelarEvento(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Evento cancelado',
              showConfirmButton: false,
              timer: 1500
            });
            // Recarga la lista de eventos para reflejar el cambio
            this.findEventosByJuego(this.juegoId);
          },
          error: (err) => {
            console.error('Error al cancelar el evento:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo cancelar el evento.'
            });
          }
        });
      }
    });
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