import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Route, Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../../service/usuario.service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  token: string | null = sessionStorage.getItem("token");
  rol!: string;
  nombreUsuario!: any;
  id!: number;
  foto!: string;

  constructor(
    private usuarioService: UsuarioService,
    private router: Router
  ) {

    if (this.token !== null && this.token) {
      this.nombreUsuario = jwtDecode(this.token).sub;
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;
    }
  }

  ngOnInit(): void {

    if (this.token !== null && this.token) {
      this.usuarioService.getOneUsuarioLogin().subscribe(
        result => {
          this.id = result.id
          this.foto = result.foto
        },
        error => { console.log("Ha ocurrido un error") }
      )
    }
  }

  login() {
    this.router.navigateByUrl("/login");
  }

  logout() {
    sessionStorage.removeItem("token");
    this.router.navigate(['/']).then(() => window.location.reload());
  }

  obtenerRuta() {
    return this.router.url;
  }

  editar(id: number) {
    if (this.rol == 'CASETA') {
      this.router.navigateByUrl(`/caseta/editar/${id}`);
    } else if (this.rol == 'ADMIN') {
      this.router.navigateByUrl(`/admin/editar/${id}`);
    } else if (this.rol == 'SOCIO') {
      this.router.navigateByUrl(`/socio/editar/${id}`);
    } else if (this.rol == 'AYUNTAMIENTO') {
      this.router.navigateByUrl(`/ayuntamiento/editar/${id}`);
    }
  }
}