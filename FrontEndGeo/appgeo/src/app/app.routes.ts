import { Routes } from '@angular/router';
import { DashboardComponent } from './componentes/dashboard/dashboard.component'; // 📌 Importamos el Dashboard
import { LayoutComponent } from './componentes/layout/layout.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { RolesComponent } from './componentes/roles/roles.component';
import { MapPrivateComponent } from './componentes/map-private/map-private.component';
import { MapPublicComponent } from './componentes/map-public/map-public.component';
import { LoginComponent } from './componentes/login/login.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'map-private', component: MapPrivateComponent },
      { path: 'map-public', component: MapPublicComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
