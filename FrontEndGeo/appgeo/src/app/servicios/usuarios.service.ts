import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Usuarios } from '../interfaces/usuarios';
import { HttpClient } from '@angular/common/http';
import { defaultIfEmpty, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private API = 'https://localhost:7297/api/Usuarios'; 
  constructor(private http: HttpClient) { }

  ListarTodos(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.API + '/' + "ListarTodos").pipe(
      catchError(error => {
        return of();
      })
    );
  }

  ListarActivos(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.API + '/' + "ListarActivos").pipe(
      catchError(error => {
        return of();
      })
    );
  }


  PostUsuario(usuario: Usuarios): Observable<any> {
    return this.http.post(this.API + '/' + "Insertar", usuario).pipe(
      defaultIfEmpty(null),  
      catchError(error => {
        return throwError(() => error);
      })
    );
}
  
  PutUsuario(id: number, usuario: Usuarios): Observable<Usuarios> {
    console.log("Llamando a API con URL:", this.API + '/' + "Modificar" + '/' + id);
    return this.http.put<Usuarios>(`${this.API}/Modificar/${id}`, usuario).pipe(
      catchError(error => {
        console.error("Error en la petición HTTP:", error);
        return of();
      })
    );
  }
  
 
  DeleteUsuario(id: number): Observable<Usuarios> {
    return this.http.delete<Usuarios>(this.API + '/' + id).pipe(
      catchError(error => {
        return of();
      })
    );
  }

}