import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { JuegoService } from '../../../service/juego.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ActorService } from '../../../service/actor.service';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-form-juego',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './form-juego.component.html',
  styleUrl: './form-juego.component.css'
})
export class FormJuegoComponent implements OnInit {
  formJuego!: FormGroup;

  constructor(
    private juegoService: JuegoService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.formJuego = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', [Validators.required, Validators.minLength(3)]],
      categoria: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.comprobarRol();
  }

  save(): void {
    if (this.formJuego.valid) {
      const juegoData = this.formJuego.value;
  
      this.juegoService.saveJuego(juegoData).subscribe({
        next: (response) => {
          Swal.fire({
            icon: 'success',
            title: 'Juego creado',
            text: 'El juego se ha creado correctamente.'
          }).then(() => {
            this.router.navigate(['/']);
          });
        },
        error: (error) => {
          console.error('Error al crear el juego', error);
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo crear el juego. Inténtalo de nuevo.'
          });
        }
      });
    } else {
      console.warn('Formulario no válido');
      this.formJuego.markAllAsTouched();
    }
  }
  


  private comprobarRol(): void {
    const token = sessionStorage.getItem('token');
    if (token) {
      const decodedToken = jwtDecode<{ rol: string }>(token);
      if (decodedToken.rol !== 'ADMIN') {
        this.router.navigate(['/']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }
}
