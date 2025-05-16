import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Solicitud } from '../../../interfaces/solicitud';
import { SolicitudService } from '../../../service/solicitud.service';
import { Router } from '@angular/router';

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

  constructor(
    private solicitudService: SolicitudService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.cargarSolicitudes();
  }

  cargarSolicitudes() {
    this.solicitudService.getAllSolicitudesByUsuario().subscribe({
      next: (data) => {
        this.solicitudes = data;
        this.solicitudesFiltradas = data;
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
