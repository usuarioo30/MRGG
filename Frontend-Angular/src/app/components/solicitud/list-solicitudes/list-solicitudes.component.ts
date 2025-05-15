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

@Component({
  selector: 'app-list-solicitudes',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list-solicitudes.component.html',
  styleUrl: './list-solicitudes.component.css'
})
export class ListSolicitudesComponent implements OnInit {
  public solicitudes: Solicitud[] = [];
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
    console.log(id);
    if (this.token !== null && this.token && id != null) {
      this.solicitudService.getAllSolicitudByEvento(Number(id)).subscribe(
        result => {
          this.solicitudes = result;
        },
        error => { console.log("Ha ocurrido un error") }
      )
    }
  }

  usernameBySolicitud(id: number): void {
    let username;
    this.solicitudService.getSolicitudDeUser().subscribe(
      result => {
        username = result.username;
      },
      error => { console.log("Ha ocurrido un error") }
    )
  }
}
