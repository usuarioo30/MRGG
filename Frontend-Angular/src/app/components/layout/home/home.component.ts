import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { JuegoService } from '../../../service/juego.service';
import { jwtDecode } from 'jwt-decode';
import { Juego } from '../../../interfaces/juego';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  public juegos: Juego[] = [];

  token: string | null = sessionStorage.getItem("token");
  nombre: any;
  rol!: string;

  constructor(
    private router: Router,
    private juegoService: JuegoService
  ) {
    if (this.token !== null && this.token) {
      this.nombre = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {
    this.findAllJuegos();
  }

  findAllJuegos() {
    this.juegoService.getAllJuegos().subscribe(
      result => { this.juegos = result; },
      error => { console.log(error); }
    );
  }
}
