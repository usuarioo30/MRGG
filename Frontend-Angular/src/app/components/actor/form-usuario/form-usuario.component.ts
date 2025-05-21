import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../service/usuario.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActorService } from '../../../service/actor.service';

@Component({
  selector: 'app-form-usuario',
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './form-usuario.component.html',
  styleUrl: './form-usuario.component.css'
})
export class FormUsuarioComponent implements OnInit {

  formUsuario!: FormGroup;
  id!: number;
  registro: boolean = true;
  token!: string | null;

  constructor(
    private usuarioService: UsuarioService,
    private actorService: ActorService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Creamos el formulario sin validaciones aún
    this.formUsuario = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      passconfirm: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern('[6-9]{1}[0-9]{8}')]],
      chat_id: [''],
      clave_segura: [''],
      baneado: [false]
    }, { validator: this.comprobarContrasena });
    if (this.router.url.includes("editar")) {
      this.formUsuario.get("username")?.disable();
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
          window.alert("El nombre de usuario ya está en uso. Por favor, elige otro.");
        } else {
          if (this.token) {
            // Edición de usuario
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
                const actorLogin = {
                  username: usuario.username,
                  password: usuario.password
                };
                this.actorService.login(actorLogin).subscribe(
                  loginResult => {
                    sessionStorage.setItem("token", loginResult.token);
                    sessionStorage.setItem("username", usuario.username);
                    this.router.navigateByUrl("/").then(() => window.location.reload());;
                  },
                  loginError => {
                    console.log("Error al iniciar sesión automáticamente", loginError);
                    window.alert("Usuario registrado, pero no se pudo iniciar sesión automáticamente.");
                  }
                );
              },
              error => {
                console.log(error);
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
    var confirmacion = window.confirm("¿Estas seguro de eliminar el usuario?");
    if (confirmacion) {
      this.usuarioService.deleteUsuario().subscribe(
        result => { this.logout() },
        error => { console.log(error.status) }
      );
    }
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
