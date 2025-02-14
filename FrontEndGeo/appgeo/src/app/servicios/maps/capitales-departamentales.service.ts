import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CapitalesDepartamentales } from '../../interfaces/capitales-departamentales';

@Injectable({
  providedIn: 'root'
})
export class CapitalesDepartamentalesService {
  private API = 'https://localhost:7297/api/Capitales_Departamentales';
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<CapitalesDepartamentales[]> {
    return this.http.get<CapitalesDepartamentales[]>(this.API+'/'+"ListarTodos").pipe(
      catchError(error => {
        return of();
      })
    );
  }
}
