import { Routes } from '@angular/router';
import { RolesComponent } from './componentes/roles/roles.component';
import { UsuariosComponent } from './componentes/usuarios/usuarios.component';
import { LayoutComponent } from './componentes/layout/layout.component';
import { MapPrivateComponent } from './componentes/map-private/map-private.component';
import { MapPublicComponent } from './componentes/map-public/map-public.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: 'usuarios', component: UsuariosComponent },
      { path: 'roles', component: RolesComponent },
      { path: 'map-private', component: MapPrivateComponent },
      { path: 'map-public', component: MapPublicComponent },
    ],
  },
];
