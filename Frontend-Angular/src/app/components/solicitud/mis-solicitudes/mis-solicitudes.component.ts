import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Solicitud } from '../../../interfaces/solicitud';
import { SolicitudService } from '../../../service/solicitud.service';
import { Router } from '@angular/router';
import { EventoService } from '../../../service/evento.service';
import { Evento } from '../../../interfaces/evento';

@Component({
  selector: 'app-mis-solicitudes',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.css'
})
export class MisSolicitudesComponent implements OnInit {
  solicitudes: Solicitud[] = [];
  solicitudesFiltradas: Solicitud[] = [];
  filtroEstado: string = '';

  eventos: { [key: number]: Evento | undefined } = {};

  constructor(
    private solicitudService: SolicitudService,
    private eventoService: EventoService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
    console.log(this.eventos);
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
    var confirmacion = window.confirm("¿Estas seguro de eliminar la solicitud?");
    if (confirmacion) {
      this.solicitudService.deleteSolicitud(id).subscribe(
        result => {
          this.cargarSolicitudes();
        },
        error => { console.log(error) }
      );
    }
  }

}
