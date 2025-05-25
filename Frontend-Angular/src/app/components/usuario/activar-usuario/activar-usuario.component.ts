import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../../../service/usuario.service';

@Component({
  selector: 'app-activar-usuario',
  imports: [],
  templateUrl: './activar-usuario.component.html',
  styleUrl: './activar-usuario.component.css'
})
export class ActivarUsuarioComponent implements OnInit {

  claveSegura!: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private usuarioService: UsuarioService
  ) { }

  ngOnInit(): void {
    this.claveSegura = this.route.snapshot.paramMap.get('clave') || '';

    if (this.claveSegura != "") {
      this.usuarioService.activarUsuario(this.claveSegura).subscribe(
        result => {
          this.router.navigateByUrl('/');
        },
        error => {
          this.router.navigateByUrl("/error");
        }
      )
    }
  }

}
