import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DepartamentoInforDTO } from '../../interfaces/departamento-infor-dto';

@Injectable({
  providedIn: 'root'
})
export class DepartamentoinfoService {
  private apiUrl = 'https://localhost:7297/api'; // Tu URL base

  constructor(private http: HttpClient) {}

  obtenerInformacionDepartamento(longitud: number, latitud: number): Observable<DepartamentoInforDTO[]> {
    return this.http.get<DepartamentoInforDTO[]>(`${this.apiUrl}/Departamento/informacion`, {
      params: {
        longitud: longitud.toString(),
        latitud: latitud.toString()
      }
    });
  }
}
