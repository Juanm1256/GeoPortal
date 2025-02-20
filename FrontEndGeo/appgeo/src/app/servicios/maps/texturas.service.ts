import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, throwError } from 'rxjs';
import { Texturas } from '../../interfaces/texturas';

@Injectable({
  providedIn: 'root'
})
export class TexturasService {
  
  private API = 'https://localhost:7297/api';
  constructor(private http: HttpClient) { }

  private handleError(error: any): Observable<never> {
    console.error('Error en la petición:', error);
    return throwError(() => new Error('Error en la petición al servidor'));
  }

  private getTexturas(endpoint: string): Observable<Texturas[]> {
    return this.http.get<Texturas[]>(`${this.API}/Texturas/${endpoint}`).pipe(
      catchError(this.handleError)
    );
  }

  ListarTexturasuelocero(): Observable<Texturas[]> {
    return this.getTexturas('ListarTexturasuelocero');
  }

  ListarTexturasuelodiez(): Observable<Texturas[]> {
    return this.getTexturas('ListarTexturasuelodiez');
  }

  ListarTexturasuelotreinta(): Observable<Texturas[]> {
    return this.getTexturas('ListarTexturasuelotreinta');
  }

  ListarTexturasuelosesenta(): Observable<Texturas[]> {
    return this.getTexturas('ListarTexturasuelosesenta');
  }

  ListarTexturasuelocien(): Observable<Texturas[]> {
    return this.getTexturas('ListarTexturasuelocien');
  }

  ListarTexturasuelodoscientos(): Observable<Texturas[]> {
    return this.getTexturas('ListarTexturasuelodoscientos');
  }
}
