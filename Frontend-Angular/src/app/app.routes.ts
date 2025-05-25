import { Routes } from '@angular/router';
import { LoginComponent } from './components/actor/login/login.component';
import { HomeComponent } from './components/layout/home/home.component';
import { FormUsuarioComponent } from './components/actor/form-usuario/form-usuario.component';
import { FormContrasenaComponent } from './components/actor/form-contrasena/form-contrasena.component';
import { ListUsuarioComponent } from './components/usuario/list-usuario/list-usuario.component';
import { FormAdminComponent } from './components/actor/form-admin/form-admin.component';
import { ListEventosComponent } from './components/evento/list-eventos/list-eventos.component';
import { FormJuegoComponent } from './components/juego/form-juego/form-juego.component';
import { ListSolicitudesComponent } from './components/solicitud/list-solicitudes/list-solicitudes.component';
import { MisEventosComponent } from './components/evento/mis-eventos/mis-eventos.component';
import { MisSolicitudesComponent } from './components/solicitud/mis-solicitudes/mis-solicitudes.component';
import { MostrarEventoComponent } from './components/evento/mostrar-evento/mostrar-evento.component';
import { ActivarUsuarioComponent } from './components/usuario/activar-usuario/activar-usuario.component';
import { NotFound404Component } from './components/layout/not-found404/not-found404.component';

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
    { path: "usuario/actualizarContrasena/:clave", component: FormContrasenaComponent },

    // EVENTO
    { path: "eventos/:id", component: ListEventosComponent },
    { path: "misEventos", component: MisEventosComponent },
    { path: "evento/:id", component: MostrarEventoComponent },

    // JUEGO
    { path: "juego/crear", component: FormJuegoComponent },

    // SOLICITUD
    { path: "solicitudes", component: ListSolicitudesComponent },
    { path: "solicitudes/delEvento/:id", component: ListSolicitudesComponent },
    { path: "solicitudes/enviadas", component: MisSolicitudesComponent },

    // ACTIVAR USUARIO
    { path: "usuario/verificarUsuario/:clave", component: ActivarUsuarioComponent },

    // ERROR
    { path: "error", component: NotFound404Component }
];
