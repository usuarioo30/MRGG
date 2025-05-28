import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../service/usuario.service';
import { ActorService } from '../../../service/actor.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ignoreElements } from 'rxjs';
import { AdminService } from '../../../service/admin.service';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-contrasena',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-contrasena.component.html',
  styleUrl: './form-contrasena.component.css'
})
export class FormContrasenaComponent implements OnInit {

  token2: string | null = sessionStorage.getItem("token");

  formContrasena!: FormGroup;
  registro: boolean = true;
  token!: string | null;
  claveUsuario!: string | null;
  rol!: string | null;

  constructor(
    private usuarioService: UsuarioService,
    private actorService: ActorService,
    private adminService: AdminService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formContrasena = this.fb.group({
      passnueva: ['', [Validators.required, Validators.minLength(3)]],
      passconfirm: ['', [Validators.required, Validators.minLength(3)]]
    }, { validator: this.comprobarContrasena });
  }

  ngOnInit(): void {
    this.token = sessionStorage.getItem("token");
    this.claveUsuario = this.route.snapshot.paramMap.get('clave');

    if (!this.token && !this.claveUsuario) {
      this.router.navigateByUrl("/");
    }
  }

  save() {
    const contrasena = this.formContrasena.get("passnueva")?.value;
    if (!contrasena) return;

    if (this.claveUsuario) {
      this.actorService.recuperarContrasena(contrasena, this.claveUsuario).subscribe(
        result => {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada',
            text: 'La contraseña ha sido actualizada correctamente.'
          }).then(() => {
            this.router.navigateByUrl("/login");
          });
        },
        error => {
          console.error("Error en recuperación de contraseña:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la contraseña.'
          });
        }
      );
    } else if (this.token) {
      if (this.token !== null && this.token) {
        this.rol = jwtDecode<{ rol: string }>(this.token).rol;
      }

      const servicio = this.rol === "ADMIN" ? this.adminService : this.usuarioService;

      servicio.updateContrasena(contrasena).subscribe(
        result => {
          Swal.fire({
            icon: 'success',
            title: 'Contraseña actualizada',
            text: 'La contraseña ha sido actualizada correctamente.'
          }).then(() => {
            this.router.navigateByUrl("/");
          });
        },
        error => {
          console.error("Error actualizando contraseña:", error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar la contraseña.'
          });
        }
      );
    } else {
      this.router.navigateByUrl("/");
    }
  }

  private comprobarContrasena(group: FormGroup) {
    const password = group.get('passnueva')?.value;
    const confirmPassword = group.get('passconfirm')?.value;

    return password && confirmPassword && password !== confirmPassword
      ? { passNoCoinciden: true }
      : null;
  }

}
