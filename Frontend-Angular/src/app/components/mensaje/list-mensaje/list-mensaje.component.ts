import { Component, OnInit } from '@angular/core';
import { Mensaje } from '../../../interfaces/mensaje';
import { MensajeService } from '../../../service/mensaje.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../service/usuario.service';

@Component({
  selector: 'app-list-mensaje',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './list-mensaje.component.html',
  styleUrls: ['./list-mensaje.component.css']
})
export class ListMensajeComponent implements OnInit {
  token: string | null = sessionStorage.getItem("token");
  rol!: string | null;
  nombreUsuario!: any;

  usuarios: string[] = [];

  formMensaje!: FormGroup;
  mensajes: Mensaje[] = [];

  usernameDestino: string = '';
  mensajeSeleccionado: Mensaje | null = null;

  filtroTipo: 'USUARIO' | 'ADMIN' = 'USUARIO';
  filtroLeido: 'LEIDOS' | 'NO_LEIDOS' = 'NO_LEIDOS';



  constructor(
    private mensajeService: MensajeService,
    private usuarioService: UsuarioService,
    private fb: FormBuilder
  ) {
    this.formMensaje = this.fb.group({
      asunto: ['', Validators.required],
      cuerpo: ['', Validators.required],
      destinatario: ['']
    });
  }

  ngOnInit(): void {

    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;

      if (this.rol === 'ADMIN') {
        this.cargarMensajesAdmin();
      } else if (this.rol === 'USER') {
        this.cargarMensajesUsuario();
      }
    }
  }

  mensajeLeido(mensaje: Mensaje): boolean {
    if (!mensaje.usuarioQueLee) return false;
    return mensaje.usuarioQueLee.includes(this.nombreUsuario);
  }

  get mensajesFiltrados(): Mensaje[] {
    let filtrados = this.mensajes;

    if (this.filtroTipo === 'USUARIO') {
      filtrados = filtrados.filter(m => !m.esAdmin);
    } else if (this.filtroTipo === 'ADMIN') {
      filtrados = filtrados.filter(m => m.esAdmin);
    }

    if (this.filtroLeido === 'LEIDOS') {
      filtrados = filtrados.filter(m => this.mensajeLeido(m));
    } else if (this.filtroLeido === 'NO_LEIDOS') {
      filtrados = filtrados.filter(m => !this.mensajeLeido(m));
    }

    return filtrados;
  }

  abrirModalDetalle(mensaje: Mensaje): void {
    this.mensajeSeleccionado = mensaje;

    if (!this.mensajeLeido(mensaje)) {
      this.mensajeService.marcarComoLeido(mensaje.id).subscribe({
        next: (mensajeActualizado) => {
          const index = this.mensajes.findIndex(m => m.id === mensaje.id);
          if (index !== -1) {
            this.mensajes[index] = mensajeActualizado;
          }
        },
        error: () => {
        }
      });
    }
  }

  cargarMensajesAdmin(): void {
    this.mensajeService.getMensajesAdmin().subscribe(mensajes => {
      this.mensajes = mensajes;
      mensajes.forEach(m => {
        if (m.esAdmin == false) {
          this.usuarioService.getUserMensaje(m.id).subscribe(
            res => {
              this.usuarios[m.id] = res.username;
            },
            err => {
              this.usuarios[m.id] = 'Error';
            }
          );
        } else {
          this.usuarios[m.id] = 'Administración';
        }
      });
    });
  }

  cargarMensajesUsuario(): void {
    this.mensajeService.getMensajesUsuario().subscribe(mensajes => {
      this.mensajes = mensajes;
    });
  }

  enviarMensaje(): void {
    if (this.formMensaje.valid) {
      const nuevoMensaje: Mensaje = {
        ...this.formMensaje.value,
        fechaEnvio: new Date()
      };

      const destinatario = this.formMensaje.get('destinatario')?.value;

      if (this.rol === 'ADMIN') {
        if (!destinatario) {
          Swal.fire({
            icon: 'warning',
            title: 'Falta destinatario',
            text: 'Debes indicar un destinatario',
          });
          return;
        }

        this.mensajeService.enviarMensajeDesdeAdmin(nuevoMensaje, destinatario).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Mensaje enviado',
              text: 'El mensaje fue enviado correctamente.',
            });
            this.finalizarEnvio();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al enviar el mensaje. Intente de nuevo.',
            });
          }
        });

      } else {
        this.mensajeService.enviarMensajeDesdeUsuario(nuevoMensaje).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Mensaje enviado',
              text: 'El mensaje fue enviado correctamente.',
            });
            this.finalizarEnvio();
          },
          error: () => {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Error al enviar el mensaje. Intente de nuevo.',
            });
          }
        });
      }
    }
  }

  finalizarEnvio(): void {
    this.formMensaje.reset();
    this.usernameDestino = '';
    this.ngOnInit();
  }
}
