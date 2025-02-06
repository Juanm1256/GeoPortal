import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Roles } from '../interfaces/roles';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private API = 'https://localhost:7297/api/Roles';
  constructor(private http: HttpClient) { }

  ListarTodos(): Observable<Roles[]>{
    return this.http.get<Roles[]>(this.API+'/'+"ListarTodos");
  }
  ListarActivos(): Observable<Roles[]>{
    return this.http.get<Roles[]>(this.API+'/'+"ListarActivos");
  }
  PostRol(rol:Roles): Observable<Roles>{
    return this.http.post<Roles>(this.API+'/'+"Insertar",rol);
  }
  PutRol(id: number, rol: Roles): Observable<Roles>{
    return this.http.put<Roles>(this.API+'/'+"Modificar"+'/'+id, rol);
  }
  DeleteRol(id: number):Observable<Roles>{
    return this.http.delete<Roles>(this.API+'/'+id);
  }
}
