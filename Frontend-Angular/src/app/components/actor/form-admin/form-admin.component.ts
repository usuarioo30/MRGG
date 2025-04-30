import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AdminService } from '../../../service/admin.service';
import { ActorService } from '../../../service/actor.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-form-admin',
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './form-admin.component.html',
  styleUrl: './form-admin.component.css'
})
export class FormAdminComponent implements OnInit {
  formAdmin!: FormGroup;
  id!: number;
  registro: boolean = true;
  token!: string | null;

  constructor(
    private adminService: AdminService,
    private actorService: ActorService,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.formAdmin = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      foto: ['', [Validators.required, Validators.pattern('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]],
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      passconfirm: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern('[6-9]{1}[0-9]{8}')]],
      chat_id: [''],
      clave_segura: [''],
      baneado: [false]
    });
    if (this.router.url.includes("editar")) {
      this.formAdmin.get("username")?.disable();
      this.formAdmin.get("password")?.setValidators(null);
      this.formAdmin.get("passconfirm")?.setValidators(null);
    }
  }

  ngOnInit(): void {
    this.token = sessionStorage.getItem("token");

    if (this.token) {
      this.actorService.actorLogueado().subscribe(
        result => {
          this.formAdmin.patchValue(result);
        },
        error => {
          this.router.navigateByUrl("/");
        },
      );
    }
  }

  save() {
    const admin = this.formAdmin.value;

    this.actorService.actorExist(admin.username).subscribe(
      exists => {
        if (exists) {
          window.alert("El nombre de admin ya está en uso. Por favor, elige otro.");
        } else {
          if (this.token) {
            this.adminService.editAdmin(admin).subscribe(
              result => {
                window.alert("Perfil actualizado correctamente");
                this.router.navigateByUrl("/");
              },
              error => { console.log(error); }
            );
          } else {
            this.adminService.saveAdmin(admin).subscribe(
              result => {
                window.alert("admin creado correctamente");
                this.router.navigateByUrl("/");
              },
              error => { console.log(error); }
            );
          }
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  eliminarAdmin() {
    var confirmacion = window.confirm("¿Estas seguro de eliminar el admin?");
    if (confirmacion) {
      this.adminService.deleteAdmin().subscribe(
        result => { this.logout() },
        error => { console.log(error.status) }
      );
    }
  }

  logout() {
    sessionStorage.removeItem("token");
    this.router.navigate(['/']).then(() => window.location.reload());
  }
}
