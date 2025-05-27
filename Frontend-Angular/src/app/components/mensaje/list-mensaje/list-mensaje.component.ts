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

  abrirModalDetalle(mensaje: Mensaje): void {
    this.mensajeSeleccionado = mensaje;
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
          next: (res) => {
            if (res) {
              Swal.fire({
                icon: 'success',
                title: 'Mensaje enviado',
                text: 'El mensaje fue enviado correctamente.',
              });
              this.finalizarEnvio();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo enviar el mensaje.',
              });
            }
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
          next: (res) => {
            if (res) {
              Swal.fire({
                icon: 'success',
                title: 'Mensaje enviado',
                text: 'El mensaje fue enviado correctamente.',
              });
              this.finalizarEnvio();
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'No se pudo enviar el mensaje.',
              });
            }
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
