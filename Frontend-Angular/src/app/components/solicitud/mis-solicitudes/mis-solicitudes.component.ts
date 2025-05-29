import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Solicitud } from '../../../interfaces/solicitud';
import { SolicitudService } from '../../../service/solicitud.service';
import { Router, RouterLink } from '@angular/router';
import { EventoService } from '../../../service/evento.service';
import { Evento } from '../../../interfaces/evento';
import { Usuario } from '../../../interfaces/usuario';
import { UsuarioService } from '../../../service/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.css'
})
export class MisSolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  solicitudesFiltradas: Solicitud[] = [];
  filtroEstado: string = '';

  eventos: { [key: number]: Evento | undefined } = {};

  userLogin!: Usuario;
  baneado: boolean = false;

  constructor(
    private solicitudService: SolicitudService,
    private eventoService: EventoService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuarioService.getOneUsuarioLogin().subscribe({
      next: (usuario) => {
        this.userLogin = usuario;
        this.baneado = usuario.baneado;
        if (!this.baneado) {
          this.cargarSolicitudes();
        }
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        this.cargarSolicitudes();
      }
    });
  }

  cargarSolicitudes() {
    this.solicitudService.getAllSolicitudesByUsuario().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.solicitudesFiltradas = data;
        this.solicitudes.forEach(solicitud => {
          this.eventoService.getEventosBySolicitud(solicitud.id).subscribe(
            res => this.eventos[solicitud.id] = res,
            err => console.log("Error evento no encontrado")
          );
        });
      },
      error: (err) => {
        console.error('Error al obtener solicitudes del usuario', err);
      }
    });
  }

  filtrarSolicitudes() {
    if (this.filtroEstado === '') {
      this.solicitudesFiltradas = this.solicitudes;
    } else {
      this.solicitudesFiltradas = this.solicitudes.filter(solicitud => solicitud.estado.toString() === this.filtroEstado);
    }
  }

  eliminarSolicitud(id: number) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la solicitud permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6'
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudService.deleteSolicitud(id).subscribe(
          () => {
            this.cargarSolicitudes();
            Swal.fire({
              icon: 'success',
              title: 'Eliminado',
              text: 'La solicitud ha sido eliminada exitosamente.',
              confirmButtonColor: '#3085d6'
            });
          },
          error => {
            console.error(error);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al eliminar la solicitud.',
              confirmButtonColor: '#d33'
            });
          }
        );
      }
    });
  }

}
