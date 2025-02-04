import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rol } from '../interfaces/rol';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolService {

  private API = 'https://localhost:7297/api/Roles';
  constructor(private http: HttpClient) { }

  ListarTodos(): Observable<Rol[]>{
    return this.http.get<Rol[]>(this.API+'/'+"ListarTodos");
  }
  ListarActivos(): Observable<Rol[]>{
    return this.http.get<Rol[]>(this.API+'/'+"ListarActivos");
  }
  PostRol(rol:Rol): Observable<Rol>{
    return this.http.post<Rol>(this.API+'/'+"Insertar",rol);
  }
  PutRol(id: number, rol: Rol): Observable<Rol>{
    return this.http.put<Rol>(this.API+'/'+"Modificar"+'/'+id, rol);
  }
  DeleteRol(id: number):Observable<Rol>{
    return this.http.delete<Rol>(this.API+'/'+id);
  }
}
