import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../../service/usuario.service';
import { ActorService } from '../../../service/actor.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ignoreElements } from 'rxjs';

@Component({
  selector: 'app-form-contrasena',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-contrasena.component.html',
  styleUrl: './form-contrasena.component.css'
})
export class FormContrasenaComponent implements OnInit {

  formContrasena!: FormGroup;
  registro: boolean = true;
  token!: string | null;
  claveUsuario!: string | null;

  constructor(
    private usuarioService: UsuarioService,
    private actorService: ActorService,
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
    if (this.token) {
      const contrasena = this.formContrasena.get("passnueva")?.value;
      if (contrasena) {
        this.usuarioService.updateContrasena(contrasena).subscribe(
          result => {
            window.alert("Contraseña actualizada correctamente");
            this.router.navigateByUrl("/");
          },
          error => { console.log(error); }
        );
      }
    } else {
      if (this.claveUsuario) {
        const contrasena = this.formContrasena.get("passnueva")?.value;
        if (contrasena) {
          this.usuarioService.recuperarContrasena(contrasena, this.claveUsuario).subscribe(
            result => {
              window.alert("Contraseña actualizada correctamente");
              this.router.navigateByUrl("/");
            },
            error => { console.log(error); }
          );
        }
      }
    }
  }

  private comprobarContrasena(group: FormGroup) {
    const password = group.get('passnueva')?.value;
    const confirmPassword = group.get('passconfirm')?.value;

    return password && confirmPassword && password !== confirmPassword ? { passNoCoinciden: true } : null;
  }

}
