import { Routes } from '@angular/router';
import { DashboardComponent } from './componentes/dashboard/dashboard.component';
import { LayoutComponent } from './componentes/layout/layout.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { RolesComponent } from './componentes/roles/roles.component';
import { MapPrivateComponent } from './componentes/map-private/map-private.component';
import { MapPublicComponent } from './componentes/map-public/map-public.component';
import { LoginComponent } from './componentes/login/login.component';
import { AuthGuard } from './servicios/auth.guard.service';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'map-public', component: MapPublicComponent }, // ✅ Rutas accesibles para visitantes

  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }, // ✅ Protegido
      { path: 'usuarios', component: UsuariosComponent, canActivate: [AuthGuard] }, // ✅ Protegido
      { path: 'roles', component: RolesComponent, canActivate: [AuthGuard] }, // ✅ Protegido
      { path: 'map-private', component: MapPrivateComponent, canActivate: [AuthGuard] }, // ✅ Protegido
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' }
    ]
  },

  { path: '**', redirectTo: 'login' } // ✅ Redirige cualquier ruta desconocida al login
];
