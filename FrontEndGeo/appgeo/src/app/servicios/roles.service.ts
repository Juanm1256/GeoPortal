import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Roles } from '../interfaces/roles';
import { Observable } from 'rxjs';
import { Permisos } from '../interfaces/permisos';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private API = 'https://localhost:7297/api';
  constructor(private http: HttpClient) { }

  
  ListarTodos(): Observable<Roles[]>{
    return this.http.get<Roles[]>(this.API+'/Roles/'+"ListarTodos");
  }
  ListarPermiso(): Observable<Permisos[]>{
    return this.http.get<Permisos[]>(this.API+'/Roles/'+"ListarPermisos");
  }
  ListarRolPermisoActivos(): Observable<Roles[]>{
    return this.http.get<Roles[]>(this.API+'/Rol_Permiso/'+"ListarActivos");
  }
  PostRol(rol:Roles): Observable<Roles>{
    return this.http.post<Roles>(this.API+'/Roles/'+"Insertar",rol);
  }
  PutRol(id: number, rol: Roles): Observable<Roles>{
    return this.http.put<Roles>(this.API+'/Roles/'+"Modificar"+'/'+id, rol);
  }
  DeleteRol(id: number):Observable<Roles>{
    return this.http.delete<Roles>(this.API+'/Roles/'+id);
  }
}
