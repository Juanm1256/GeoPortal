import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { ProveedorAsistenciaTecnica } from '../../interfaces/proveedor-asistencia-tecnica';

@Injectable({
  providedIn: 'root'
})
export class ProveedorasistenciatecnicaService {
  private API = 'https://localhost:7297/api/ProveedorAsistenciaTecnica';
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<ProveedorAsistenciaTecnica[]> {
    return this.http.get<ProveedorAsistenciaTecnica[]>(this.API+'/'+"ListarTodos").pipe(
      catchError(error => {
        return of();
      })
    );
  }
}
