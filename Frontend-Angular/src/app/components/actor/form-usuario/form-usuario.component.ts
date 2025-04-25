import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../service/usuario.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ActorService } from '../../../service/actor.service';

@Component({
  selector: 'app-form-usuario',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.css'
})
export class FormUsuarioComponent implements OnInit {

  formUsuario!: FormGroup;
  id!: number;
  registro: boolean = true;
  token!: string | null;
  usernameOriginal!: string;

  constructor(
    private usuarioService: UsuarioService,
    private actorService: ActorService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Creamos el formulario sin validaciones aún
    this.formUsuario = this.fb.group({
      id: [null],
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      foto: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      passconfirm: [''],
      password: [''],
      telefono: ['', [Validators.required, Validators.pattern('[6-9]{1}[0-9]{8}')]],
      chat_id: [''],
      clave_segura: [''],
      baneado: [false]
    }, { validator: this.comprobarContrasena });
  }

  ngOnInit(): void {
    this.token = sessionStorage.getItem("token");

    if (this.token) {
      this.registro = false;
      this.actorService.usuarioLogueado().subscribe(
        result => {
          this.formUsuario.patchValue(result);
          this.usernameOriginal = result.username;

          // Si está editando, quitamos las validaciones de contraseña
          this.formUsuario.get("password")?.clearValidators();
          this.formUsuario.get("passconfirm")?.clearValidators();
          this.formUsuario.get("password")?.updateValueAndValidity();
          this.formUsuario.get("passconfirm")?.updateValueAndValidity();

          this.formUsuario.get("password")?.setValue("");
          this.formUsuario.get("passconfirm")?.setValue("");
        },
        error => { console.log("Usuario no encontrado") }
      );
    } else {
      // Si está registrando, aplicamos validaciones de contraseña
      this.formUsuario.get("password")?.setValidators([Validators.required, Validators.minLength(3), Validators.maxLength(20)]);
      this.formUsuario.get("passconfirm")?.setValidators([Validators.required]);
      this.formUsuario.get("password")?.updateValueAndValidity();
      this.formUsuario.get("passconfirm")?.updateValueAndValidity();
    }
  }

  save() {
    const usuario = this.formUsuario.value;

    // Si está editando y no ha cambiado contraseña, la eliminamos del objeto a enviar
    if (this.token && !usuario.password) {
      delete usuario.password;
      delete usuario.passconfirm;
    }

    this.actorService.actorExist(usuario.username).subscribe(
      exists => {
        if (exists && usuario.username !== this.usernameOriginal) {
          window.alert("El nombre de usuario ya está en uso. Por favor, elige otro.");
        } else {
          if (this.token) {
            this.usuarioService.editUsuario(usuario).subscribe(
              result => {
                window.alert("Perfil actualizado correctamente");
                this.router.navigateByUrl("/");
              },
              error => { console.log(error); }
            );
          } else {
            this.usuarioService.saveUsuario(usuario).subscribe(
              result => {
                window.alert("Usuario creado correctamente");
                this.router.navigateByUrl("/");
              },
              error => { console.log(error); }
            );
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  private comprobarContrasena(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('passconfirm')?.value;

    if (!password && !confirmPassword) {
      return null;
    }

    return password !== confirmPassword ? { passNoCoinciden: true } : null;
  }
}
