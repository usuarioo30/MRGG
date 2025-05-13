import { Component, OnInit } from '@angular/core';
import { Solicitud } from '../../../interfaces/solicitud';
import { Evento } from '../../../interfaces/evento';
import { UsuarioService } from '../../../service/usuario.service';
import { SolicitudService } from '../../../service/solicitud.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventoService } from '../../../service/evento.service';
import { jwtDecode } from 'jwt-decode';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-solicitudes',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list-solicitudes.component.html',
  styleUrl: './list-solicitudes.component.css'
})
export class ListSolicitudesComponent implements OnInit {
  public solicitudes: Set<Solicitud> = new Set<Solicitud>;
  public eventos: Evento[] = [];
  id!: number;
  selectedEventoId!: number;
  public eventosConSolicitud: Evento[] = [];

  token: string | null = sessionStorage.getItem("token");
  rol!: string;
  nombreUsuario !: any;
  idCaseta!: number;

  constructor(
    private usuarioService: UsuarioService,
    private solicitudService: SolicitudService,
    private router: Router,
    private fb: FormBuilder,
    private eventoService: EventoService
  ) {
    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    this.solicitudService.getAllSolicitudByUsuario().subscribe(
      result => { this.solicitudes = result; },
      error => { console.log(error) }
    );

    this.eventoService.getAllEvento().subscribe(
      result => { this.eventos = result; },
      error => { console.log(error) }
    );
    this.actualizarEventosConSolicitud();

    if (this.token !== null && this.token) {
      this.usuarioService.getOneUsuarioLogin().subscribe(
        result => {
          this.idCaseta = result.id;
        },
        error => { console.log("Ha ocurrido un error") }
      )
    }
  }

  crearSolicitud() {
    this.solicitudService.saveSolicitud(this.selectedEventoId).subscribe(
      result => {
        window.location.reload();
      },
      error => {
        console.log("Solicitud no creada");
      }
    );
  }

  actualizarEventosConSolicitud() {
    this.solicitudService.getAllSolicitudByUsuario().subscribe(
      solicitudesUsuario => {
        // Convertir el Set en un Array
        const solicitudesArray = Array.from(solicitudesUsuario);

        this.eventos.forEach(evento => {
          // Comprobamos si alguna de las solicitudes del ayuntamiento ya existe en las solicitudes de la caseta
          const solicitudDeEvento = evento.solicitudes;

          solicitudDeEvento.forEach(solicitud => {
            // Comprobamos si la solicitud del ayuntamiento está en la lista de solicitudes de la caseta
            if (solicitudesArray.some(s => s.id === solicitud.id)) {
              // Si ya existe una solicitud en la caseta, añadimos el ayuntamiento a la lista
              if (!this.eventosConSolicitud.includes(evento)) {
                this.eventosConSolicitud.push(evento);
              }
            }
          });
        });
      },
      error => {
        console.log(error);
      }
    );
  }


  getIdCaseta() {
    return Number(this.usuarioService.getUsuarioId());
  }
}
