import { Component, OnInit } from '@angular/core';
import { Usuario } from '../../../interfaces/usuario';
import { UsuarioService } from '../../../service/usuario.service';
import { Router } from '@angular/router';
import { AdminService } from '../../../service/admin.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Roles } from '../../../interfaces/roles';
import { Admin } from '../../../interfaces/admin';
import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-list-usuario',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './list-usuario.component.html',
  styleUrl: './list-usuario.component.css'
})
export class ListUsuarioComponent implements OnInit {
  public usuarios: Usuario[] = [];
  public admins: Admin[] = [];
  public todos: (Usuario | Admin)[] = [];

  id!: number;
  token: string | null = sessionStorage.getItem("token");
  rol!: string | null;
  baneado!: boolean;
  formCrearAdmin!: FormGroup;

  filtroBaneado: string = 'todos';
  filtroNombre: string = '';
  filtroRol: string = Roles.USER;
  Roles = Roles;

  constructor(
    private adminService: AdminService,
    private usuarioService: UsuarioService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.formCrearAdmin = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      passconfirm: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern('^[6-9]\\d{8}$')]],
    }, { validators: this.comprobarContrasena });
  }

  ngOnInit(): void {
    if (this.token) {
      this.rol = jwtDecode<{ rol: string }>(this.token).rol;

      // Paso 1: Obtener el admin logueado
      this.adminService.getOneAdminLogin().subscribe({
        next: result => {
          this.id = result.id;

          // Paso 2: Obtener usuarios
          this.usuarioService.getAllUsuarios().subscribe({
            next: usuarios => {
              this.usuarios = usuarios;

              // Paso 3: Obtener admins (ya tenemos this.id)
              this.adminService.getAllAdmins().subscribe({
                next: admins => {
                  this.admins = admins.filter(admin => admin.id !== this.id);

                  // Paso 4: Unificar usuarios y admins
                  this.unificarUsuariosYAdmins();
                },
                error: err => console.error("Error al obtener administradores", err)
              });
            },
            error: err => console.log("Error al obtener usuarios", err)
          });
        },
        error: () => console.log("Ha ocurrido un error al obtener el admin logueado"),
      });
    }
  }


  unificarUsuariosYAdmins(): void {
    this.todos = [...this.usuarios, ...this.admins];
  }

  crearAdmin(): void {
    if (this.formCrearAdmin.invalid) {
      this.formCrearAdmin.markAllAsTouched();
      return;
    }

    const nuevoAdmin = this.formCrearAdmin.value;

    this.adminService.saveAdmin(nuevoAdmin).subscribe({
      next: () => {
        Swal.fire('Éxito', 'Administrador creado correctamente.', 'success');

        this.usuarioService.getAllUsuarios().subscribe(usuarios => {
          this.usuarios = usuarios;
          this.unificarUsuariosYAdmins();
        });

        this.adminService.getAllAdmins().subscribe(admins => {
          this.admins = admins.filter(admin => admin.id !== this.id);
          this.unificarUsuariosYAdmins();
        });

        this.formCrearAdmin.reset();
      },
      error: (error) => {
        console.error('Error al crear admin', error);
        Swal.fire('Error', 'No se pudo crear el administrador.', 'error');
      }
    });
  }

  usuariosFiltrados(): (Usuario | Admin)[] {
    let filtrados = this.todos;

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

    filtrados = filtrados.filter(usuario => usuario.rol === this.filtroRol);

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

  private comprobarContrasena(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('passconfirm')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passNoCoinciden: true };
    }
    return null;
  }
}
