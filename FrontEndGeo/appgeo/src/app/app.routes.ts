import { Routes } from '@angular/router';
import { RolesComponent } from './componentes/roles/roles.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';

export const routes: Routes = [
    { path: 'roles', component: RolesComponent },
    { path: 'usuarios', component: UsuariosComponent },
  { path: '', redirectTo: '/roles', pathMatch: 'full' }
];
