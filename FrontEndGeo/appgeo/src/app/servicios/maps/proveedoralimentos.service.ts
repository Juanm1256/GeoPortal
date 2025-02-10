import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProveedorAlimentos } from '../../interfaces/proveedor-alimentos';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedoralimentosService {
  private API = 'https://localhost:7297/api/ProveedorAlimentos';
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<ProveedorAlimentos[]> {
    return this.http.get<ProveedorAlimentos[]>(this.API+'/'+"ListarTodos");
  }
}
