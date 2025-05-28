import { Component } from '@angular/core';
import { EventoService } from '../../../service/evento.service';
import { UsuarioService } from '../../../service/usuario.service';
import { JuegoService } from '../../../service/juego.service';
import { SolicitudService } from '../../../service/solicitud.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Evento } from '../../../interfaces/evento';
import { Usuario } from '../../../interfaces/usuario';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mostrar-evento',
  imports: [ReactiveFormsModule, CommonModule, FormsModule],
  templateUrl: './mostrar-evento.component.html',
  styleUrl: './mostrar-evento.component.css'
})
export class MostrarEventoComponent {
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
  eventoUnico!: Evento;
  esMio: boolean = false;
  jugadoresAceptados: Usuario[] = [];

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

    if (this.token) {
      this.usuarioService.getOneUsuarioLogin().subscribe({
        next: (usuario) => {
          this.userLogin = usuario;
          this.nombreUsuario = usuario.username;

          this.activatedRoute.params.subscribe(params => {
            const idParam = params['id'];
            const eventoId = Number(idParam);

            if (!eventoId || isNaN(eventoId) || eventoId <= 0) {
              this.router.navigate(['/']);
            } else {
              this.eventoService.getEventoPorId(eventoId).subscribe({
                next: (evento) => {
                  this.eventoUnico = evento;
                  this.esMio = evento.usuario?.id === this.userLogin.id;
                  this.cargarJugadoresAceptados(evento.id);
                },
                error: (err) => {
                  console.error('Error al obtener el evento:', err);
                  this.router.navigate(['/']);
                }
              });
            }
          });
        },
        error: (err) => {
          console.error('Error al cargar el usuario:', err);
        }
      });
    }
  }

  cargarJugadoresAceptados(eventoId: number) {
    this.solicitudService.getAllSolicitudByEvento(eventoId).subscribe({
      next: solicitudes => {
        const solicitudesAceptadas = solicitudes.filter(s => s.estado.toString() === 'ACEPTADA');

        this.jugadoresAceptados = [];

        solicitudesAceptadas.forEach(solicitud => {
          this.usuarioService.getSolicitudDeUser(solicitud.id).subscribe({
            next: usuario => {
              this.jugadoresAceptados.push(usuario);
            },
            error: err => {
              console.error('Error al obtener usuario de solicitud:', err);
            }
          });
        });
      },
      error: err => {
        console.error('Error al cargar solicitudes:', err);
      }
    });
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
          Swal.fire('Error', 'Juego no encontrado', 'error');
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
        Swal.fire('Advertencia', 'La fecha de inicio no puede ser anterior a hoy.', 'warning');
        return;
      }

      this.eventoService.saveEventoPorJuego(this.juegoId, eventoAEnviar).subscribe(
        () => {
          Swal.fire('Éxito', 'Evento creado correctamente.', 'success');
          this.findEventosByJuego(this.juegoId);
          this.router.navigate(['/juego', this.juegoId, 'eventos']);
          window.location.reload();
        },
        error => {
          console.error('Error al crear el evento:', error);
          Swal.fire('Error', 'No se pudo crear el evento.', 'error');
        }
      );
    } else {
      console.log('Formulario no válido');
    }
  }

  solicitarUnirse(eventoId: number): void {
    this.solicitudService.saveSolicitud(eventoId).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Solicitud enviada correctamente.', 'success');
        this.findEventosByJuego(this.juegoId);
      },
      error: (error) => {
        console.error('Error al enviar la solicitud:', error);
        Swal.fire('Error', 'No se pudo enviar la solicitud.', 'error');
      }
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
          Swal.fire('Éxito', 'Evento editado correctamente.', 'success');
          this.findEventosByJuego(this.juegoId);
          this.eventoSeleccionado = undefined!;
          window.location.reload();
        },
        error => {
          console.error("Error al editar el evento:", error);
          Swal.fire('Error', 'No se pudo editar el evento.', 'error');
        }
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
            window.location.reload();
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
      Swal.fire('Error', 'No se pudo copiar el código.', 'error');
    });
  }

  mostrarToast(): void {
    setTimeout(() => {
      this.mostrarToastFlag = false;
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
