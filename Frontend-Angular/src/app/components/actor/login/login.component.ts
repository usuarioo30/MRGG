import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ActorService } from '../../../service/actor.service';
import Swal from 'sweetalert2';
import { UsuarioService } from '../../../service/usuario.service';

@Component({
  selector: 'app-form-categoria',
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  formLogin!: FormGroup;
  formRecuperar!: FormGroup;
  id!: number;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private actorService: ActorService,
    private usuarioService: UsuarioService
  ) {
    // Login
    this.formLogin = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]]
    });

    // Recuperación
    this.formRecuperar = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    if (sessionStorage.getItem("token") !== null) {
      this.router.navigate(['/']);
    }
  }

  login() {
    const actor = this.formLogin.value;
    this.actorService.login(actor).subscribe(
      tokenLogin => {
        sessionStorage.setItem("token", tokenLogin.token)
        this.router.navigate(['/']).then(() => window.location.reload());
      },
      error => {
        Swal.fire({
          icon: 'error',
          title: 'Error de autenticación',
          text: 'Usuario y/o contraseña incorrecto',
          confirmButtonColor: '#d33'
        });
      }
    );
  }

  recuperarContrasena() {
    const email = this.formRecuperar.value.email;
    console.log(email)
    this.usuarioService.mandarCorreoParaRecuperarContrasena(email).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Correo enviado',
          text: 'Se ha enviado un enlace para recuperar tu contraseña.',
          confirmButtonColor: '#3085d6'
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo enviar el correo. Intenta nuevamente.',
          confirmButtonColor: '#d33'
        });
      }
    });
  }

}