import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LimitesMunicipales } from '../../interfaces/limites-municipales';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LimitesMunicipalesService {
  private API = 'https://localhost:7297/api/Limites_Municipales';
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<LimitesMunicipales[]> {
    return this.http.get<LimitesMunicipales[]>(this.API+'/'+"ListarTodos");
  }
}
