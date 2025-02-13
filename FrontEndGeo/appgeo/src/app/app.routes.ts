import { Routes } from '@angular/router';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { LayoutComponent } from './componentes/layout/layout.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { RolesComponent } from './componentes/roles/roles.component';
import { MapPrivateComponent } from './componentes/map-private/map-private.component';
import { MapPublicComponent } from './componentes/map-public/map-public.component';
import { LoginComponent } from './componentes/login/login.component';
import { AuthGuard } from './servicios/auth.guard.service'; // 🔐 Importamos el guard

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // 🔐 Protegemos con el guard
      { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] },
      { path: 'roles', component: RolesComponent, canActivate: [AuthGuard] },
      { path: 'map-private', component: MapPrivateComponent, canActivate: [AuthGuard] },
      { path: 'map-public', component: MapPublicComponent }, 
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  }
];
