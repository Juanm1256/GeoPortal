import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LimitesDepartamentales } from '../../interfaces/limites-departamentales';

@Injectable({
  providedIn: 'root'
})
export class LimitesDepartamentalesService {
  private API = 'https://localhost:7297/api/Limites_Departamentales';
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<LimitesDepartamentales[]> {
    return this.http.get<LimitesDepartamentales[]>(this.API+'/'+"ListarTodos");
  }
}
