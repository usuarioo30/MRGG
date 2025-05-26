import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../service/usuario.service';
import { ActorService } from '../../../service/actor.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ignoreElements } from 'rxjs';
import { AdminService } from '../../../service/admin.service';
import { jwtDecode } from 'jwt-decode';

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
      passnueva: ['', [Validators.required, Validators.min(3)]],
      passconfirm: ['', [Validators.required, Validators.min(3)]]
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
      // Caso: recuperación de contraseña desde correo
      this.actorService.recuperarContrasena(contrasena, this.claveUsuario).subscribe(
        result => {
          window.alert("Contraseña actualizada correctamente");
          this.router.navigateByUrl("/login");
        },
        error => {
          console.error("Error en recuperación de contraseña:", error);
          window.alert("No se pudo actualizar la contraseña.");
        }
      );
    } else if (this.token) {
      // Caso: usuario autenticado
      if (this.token !== null && this.token) {
        this.rol = jwtDecode<{ rol: string }>(this.token).rol;
      }

      if (this.rol === "ADMIN") {
        this.adminService.updateContrasena(contrasena).subscribe(
          result => {
            window.alert("Contraseña actualizada correctamente");
            this.router.navigateByUrl("/");
          },
          error => {
            console.error("Error actualizando contraseña como admin:", error);
            window.alert("No se pudo actualizar la contraseña.");
          }
        );
      } else {
        this.usuarioService.updateContrasena(contrasena).subscribe(
          result => {
            window.alert("Contraseña actualizada correctamente");
            this.router.navigateByUrl("/");
          },
          error => {
            console.error("Error actualizando contraseña como usuario:", error);
            window.alert("No se pudo actualizar la contraseña.");
          }
        );
      }
    } else {
      this.router.navigateByUrl("/");
    }
  }



  private comprobarContrasena(group: FormGroup) {
    const password = group.get('passnueva')?.value;
    const confirmPassword = group.get('passconfirm')?.value;

    return password && confirmPassword && password !== confirmPassword ? { passNoCoinciden: true } : null;
  }

}
