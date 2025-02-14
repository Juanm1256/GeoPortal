import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RolPermisoDTO } from '../interfaces/rol-permiso-dto';
import { catchError, Observable, of } from 'rxjs';
import { RolPermiso } from '../interfaces/rol-permiso';

@Injectable({
  providedIn: 'root'
})
export class RolesPermisoService {
  private API = 'https://localhost:7297/api/Rol_Permiso';
  constructor(private http: HttpClient) {}

  insertar(rolPermisoDTO: RolPermisoDTO): Observable<boolean> {
    return this.http.post<boolean>(`${this.API}/Insertar`, rolPermisoDTO).pipe(
      catchError(error => {
        return of();
      })
    );
  }

  listarTodos(): Observable<RolPermiso[]> {
    return this.http.get<RolPermiso[]>(this.API+'/'+"ListarTodos").pipe(
      catchError(error => {
        return of();
      })
    );
  }

  modificar(rolPermisoDTO: RolPermisoDTO, nombrerol: string): Observable<boolean> {
    return this.http.put<boolean>(`${this.API}/Modificar/${nombrerol}`, rolPermisoDTO).pipe(
      catchError(error => {
        return of();
      })
    );
  }
}
