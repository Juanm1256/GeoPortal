import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Usuarios } from '../interfaces/usuarios';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  private API = 'https://localhost:7297/api/Usuarios'; 
  constructor(private http: HttpClient) { }

  ListarTodos(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.API + '/' + "ListarTodos");
  }

  ListarActivos(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.API + '/' + "ListarActivos");
  }

  PostUsuario(usuario: Usuarios): Observable<Usuarios> {
    return this.http.post<Usuarios>(this.API + '/' + "Insertar", usuario);
  }

  PutUsuario(id: number, usuario: Usuarios): Observable<Usuarios> {
    return this.http.put<Usuarios>(this.API + '/' + "Modificar" + '/' + id, usuario);
  }

  DeleteUsuario(id: number): Observable<Usuarios> {
    return this.http.delete<Usuarios>(this.API + '/' + id);
  }

}
