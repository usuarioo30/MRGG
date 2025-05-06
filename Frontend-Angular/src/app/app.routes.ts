import { Routes } from '@angular/router';
import { LoginComponent } from './components/actor/login/login.component';
import { HomeComponent } from './components/layout/home/home.component';
import { FormUsuarioComponent } from './components/actor/form-usuario/form-usuario.component';
import { FormContrasenaComponent } from './components/actor/form-contrasena/form-contrasena.component';
import { ListUsuarioComponent } from './components/usuario/list-usuario/list-usuario.component';
import { FormAdminComponent } from './components/actor/form-admin/form-admin.component';
import { ListEventosComponent } from './components/evento/list-eventos/list-eventos.component';
import { FormJuegoComponent } from './components/juego/form-juego/form-juego.component';

export const routes: Routes = [

    { path: '', component: HomeComponent },

    // LOGIN
    { path: "login", component: LoginComponent },

    // ADMIN
    { path: "admin/editar", component: FormAdminComponent },

    // USUARIO
    { path: "usuarios", component: ListUsuarioComponent },
    { path: "usuario/nuevo", component: FormUsuarioComponent },
    { path: "usuario/editar", component: FormUsuarioComponent },
    { path: "usuario/actualizarContrasena", component: FormContrasenaComponent },

    // EVENTO
    { path: "eventos/:id", component: ListEventosComponent },

    // JUEGO
    { path: "juego/crear", component: FormJuegoComponent },
];
