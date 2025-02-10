import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProveedorAlevines } from '../../interfaces/proveedor-alevines';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedoralevinesService {
  private API = 'https://localhost:7297/api/ProveedorAlevines';
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<ProveedorAlevines[]> {
    return this.http.get<ProveedorAlevines[]>(this.API+'/'+"ListarTodos");
  }
}
