import { Routes } from '@angular/router';
import { LoginComponent } from './components/actor/login/login.component';
import { HomeComponent } from './components/layout/home/home.component';
import { FormUsuarioComponent } from './components/actor/form-usuario/form-usuario.component';

export const routes: Routes = [
    
    { path: '', component: HomeComponent },

    // LOGIN
    { path: "login", component: LoginComponent },

    // USUARIO
    { path:"usuario/nuevo", component: FormUsuarioComponent },
    { path:"usuario/editar", component: FormUsuarioComponent },
];
