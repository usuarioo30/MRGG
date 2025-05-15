import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { UsuarioService } from '../../../service/usuario.service';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-list-usuario',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './list-usuario.component.html',
  styleUrl: './list-usuario.component.css'
})
export class ListUsuarioComponent implements OnInit {
  public usuarios: Usuario[] = [];
  id!: number;
  token: string | null = sessionStorage.getItem("token");
  rol!: string;
  baneado!: boolean;

  filtroBaneado: string = 'todos';
  filtroNombre: string = '';


  constructor(
    private adminService: AdminService,
    private usuarioService: UsuarioService,
    private router: Router
  ) { }

  ngOnInit(): void {
    if (this.token) {
      this.adminService.getOneAdminLogin().subscribe(
        result => {
          this.id = result.id;
        },
        error => {
          console.log("Ha ocurrido un error");
        }
      );
    }

    this.usuarioService.getAllUsuarios().subscribe(
      result => {
        this.usuarios = result;
      },
      error => {
        console.log(error);
      }
    );
  }

  usuariosFiltrados(): Usuario[] {
    let filtrados = this.usuarios;

    if (this.filtroBaneado !== 'todos') {
      const esBaneado = this.filtroBaneado === 'true';
      filtrados = filtrados.filter(usuario => usuario.baneado === esBaneado);
    }

    if (this.filtroNombre.trim() !== '') {
      const nombreBuscado = this.filtroNombre.toLowerCase();
      filtrados = filtrados.filter(usuario =>
        usuario.username.toLowerCase().includes(nombreBuscado)
      );
    }

    return filtrados;
  }

  cambiarEstadoBaneo(usuario: Usuario): void {
    const nuevoEstado = !usuario.baneado;

    this.usuarioService.cambiarEstadoBaneo(usuario.id, nuevoEstado).subscribe({
      next: () => {
        usuario.baneado = nuevoEstado;
      },
      error: (error) => {
        console.error('Error al cambiar el estado de baneo:', error);
        alert('No se pudo cambiar el estado de baneo.');
      }
    });
  }

}
