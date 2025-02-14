import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Mercados } from '../../interfaces/mercados';
import { catchError, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MercadosService {
  private API = 'https://localhost:7297/api/Mercados';
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Mercados[]> {
    return this.http.get<Mercados[]>(this.API+'/'+"ListarTodos").pipe(
      catchError(error => {
        return of();
      })
    );
  }
}
