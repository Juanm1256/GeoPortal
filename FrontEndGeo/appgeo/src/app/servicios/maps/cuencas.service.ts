import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cuencas } from '../../interfaces/cuencas';

@Injectable({
  providedIn: 'root'
})
export class CuencasService {
  private API = 'https://localhost:7297/api/Cuencas';
  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Cuencas[]> {
    return this.http.get<Cuencas[]>(this.API+'/'+"ListarTodos");
  }

}
