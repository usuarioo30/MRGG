import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { UsuarioService } from '../../../service/usuario.service';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-list-usuario',
  imports: [FormsModule],
  templateUrl: './list-usuario.component.html',
  styleUrl: './list-usuario.component.css'
})
export class ListUsuarioComponent implements OnInit {
  public usuarios: Usuario[] = [];
  id!: number;
  token: string | null = sessionStorage.getItem("token");
  rol!: string;

  // Filtro de baneado: 'todos' | 'true' | 'false'
  filtroBaneado: string = 'todos';

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

  // Método para devolver la lista filtrada
  usuariosFiltrados(): Usuario[] {
    if (this.filtroBaneado === 'todos') {
      return this.usuarios;
    }

    const esBaneado = this.filtroBaneado === 'true';
    return this.usuarios.filter(usuario => usuario.baneado === esBaneado);
  }

}
