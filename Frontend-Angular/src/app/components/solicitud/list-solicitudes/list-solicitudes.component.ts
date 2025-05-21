import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../../../interfaces/solicitud';
import { Evento } from '../../../interfaces/evento';
import { UsuarioService } from '../../../service/usuario.service';
import { SolicitudService } from '../../../service/solicitud.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventoService } from '../../../service/evento.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-solicitudes',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list-solicitudes.component.html',
  styleUrl: './list-solicitudes.component.css'
})
export class ListSolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  public eventos: Evento[] = [];
  id!: number;
  selectedEventoId!: number;
  public eventosConSolicitud: Evento[] = [];

  token: string | null = sessionStorage.getItem("token");
  rol!: string;
  nombreUsuario !: any;

  nombreUsuarios: string[] = [];


  constructor(
    private usuarioService: UsuarioService,
    private solicitudService: SolicitudService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private eventoService: EventoService
  ) {
    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (this.token !== null && this.token && id != null) {
      this.solicitudService.getAllSolicitudByEvento(Number(id)).subscribe(
        result => {
          this.solicitudes = result;
          this.solicitudes.forEach(solicitud => {
            this.usuarioService.getSolicitudDeUser(solicitud.id).subscribe(
              res => this.nombreUsuarios[solicitud.id] = res.username,
              err => this.nombreUsuarios[solicitud.id] = 'Error'
            );
          });
        },
        error => { console.log("Ha ocurrido un error") }
      )

    }
  }

  aceptarSolicitud(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Seguro que quieres aceptar la solicitud?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, aceptar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudService.acceptSolicitud(id).subscribe({
          next: (solicitudActualizada) => {
            const index = this.solicitudes.findIndex(s => s.id === id);
            if (index !== -1) {
              this.solicitudes[index] = solicitudActualizada;
            }

            Swal.fire({
              icon: 'success',
              title: 'Solicitud aceptada',
              text: 'La solicitud fue aceptada correctamente',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              window.location.reload();
            });
          },
          error: (err) => {
            console.error('Error al aceptar la solicitud:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo aceptar la solicitud',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    });
  }

  rechazarSolicitud(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Seguro que quieres rechazar la solicitud?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, rechazar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.solicitudService.refuseSolicitud(id).subscribe({
          next: (solicitudActualizada) => {
            const index = this.solicitudes.findIndex(s => s.id === id);
            if (index !== -1) {
              this.solicitudes[index] = solicitudActualizada;
            }

            Swal.fire({
              icon: 'success',
              title: 'Solicitud rechazada',
              text: 'La solicitud fue rechazada correctamente',
              confirmButtonColor: '#3085d6'
            }).then(() => {
              window.location.reload();
            });
          },
          error: (err) => {
            console.error('Error al rechazar la solicitud:', err);
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo rechazar la solicitud',
              confirmButtonColor: '#d33'
            });
          }
        });
      }
    });
  }

  volver() {
    this.router.navigateByUrl(`/misEventos`);
  }
}
