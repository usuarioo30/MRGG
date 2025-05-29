import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../service/usuario.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActorService } from '../../../service/actor.service';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-form-usuario',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.css'
})
export class FormUsuarioComponent implements OnInit {

  formUsuario!: FormGroup;
  registro: boolean = true;
  token!: string | null;
  rol!: string;
  registroExitoso: boolean = false;
  registroEnviado: boolean = false;

  constructor(
    private usuarioService: UsuarioService,
    private actorService: ActorService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {

    if (this.token !== null && this.token) {
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }

    this.formUsuario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      passconfirm: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern('[6-9]{1}[0-9]{8}')]],
    }, { validator: this.comprobarContrasena });

    if (this.router.url.includes("editar")) {
      this.formUsuario.get("username")?.disable();
      this.formUsuario.get("email")?.disable();
      this.formUsuario.get("password")?.setValidators(null);
      this.formUsuario.get("passconfirm")?.setValidators(null);
    }
  }

  ngOnInit(): void {
    this.token = sessionStorage.getItem("token");

    if (this.token) {
      this.actorService.actorLogueado().subscribe(
        result => {
          this.formUsuario.patchValue(result);
        },
        error => {
          this.router.navigateByUrl("/");
        },
      );
    }
  }

  save() {
    const usuario = this.formUsuario.value;

    this.actorService.actorExist(usuario.username).subscribe(
      exists => {
        if (exists) {
          this.formUsuario.get('username')?.setErrors({ usernameEnUso: true });
          this.formUsuario.get('email')?.setErrors({ emailEnUso: true });

        } else {
          this.registroEnviado = true;

          if (this.token) {
            this.usuarioService.editUsuario(usuario).subscribe(
              result => {
                Swal.fire({
                  icon: 'success',
                  title: 'Perfil actualizado',
                  text: 'Tu perfil ha sido actualizado correctamente.',
                  confirmButtonColor: '#3085d6'
                }).then(() => {
                  this.router.navigateByUrl("/");
                });
              },
              error => {
                console.log(error);
              }
            );
          } else {
            this.usuarioService.saveUsuario(usuario).subscribe(
              result => {
                this.registroExitoso = true;
                Swal.fire({
                  icon: 'success',
                  title: 'Registro exitoso',
                  text: 'Tu cuenta se ha creado correctamente. Verifica tu correo electrónico.',
                  confirmButtonColor: '#3085d6'
                });
              },
              error => {
                this.registroEnviado = false;
                console.log(error);
                Swal.fire({
                  icon: 'error',
                  title: 'Registro fallido',
                  text: 'Hubo un error al registrar el usuario. Inténtalo nuevamente.',
                  confirmButtonColor: '#d33'
                });
              }
            );
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  eliminarUsuario() {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará tu cuenta permanentemente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.usuarioService.deleteUsuario().subscribe(
          () => this.logout(),
          error => {
            if (error.status === 403 || error.status === 400) {
              Swal.fire({
                icon: 'error',
                title: 'No se puede eliminar el usuario',
                text: 'Debes eliminar primero tus solicitudes enviadas antes de borrar tu cuenta.',
                confirmButtonColor: '#d33'
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Error al eliminar',
                text: 'Ocurrió un error inesperado al intentar eliminar tu cuenta.',
                confirmButtonColor: '#d33'
              });
              console.log(error);
            }
          }
        );
      }
    });
  }


  logout() {
    sessionStorage.removeItem("token");
    this.router.navigate(['/']).then(() => window.location.reload());
  }

  private comprobarContrasena(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('passconfirm')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passNoCoinciden: true };
    }
    return null;
  }
}
