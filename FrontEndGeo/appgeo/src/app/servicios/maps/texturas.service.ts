import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { Texturas } from '../../interfaces/texturas';

@Injectable({
  providedIn: 'root'
})
export class TexturasService {
  
  private API = 'https://localhost:7297/api';
  constructor(private http: HttpClient) { }

  ListarTexturasuelocero(): Observable<Texturas[]>{
    return this.http.get<Texturas[]>(this.API+'/Texturas/'+"ListarTexturasuelocero").pipe(
          catchError(error => {
            return of();
          })
        );
  }
  ListarTexturasuelodiez(): Observable<Texturas[]>{
    return this.http.get<Texturas[]>(this.API+'/Texturas/'+"ListarTexturasuelodiez").pipe(
          catchError(error => {
            return of();
          })
        );
  }
  ListarTexturasuelotreinta(): Observable<Texturas[]>{
    return this.http.get<Texturas[]>(this.API+'/Texturas/'+"ListarTexturasuelotreinta").pipe(
          catchError(error => {
            return of();
          })
        );
  }
  ListarTexturasuelosesenta(): Observable<Texturas[]>{
    return this.http.get<Texturas[]>(this.API+'/Texturas/'+"ListarTexturasuelosesenta").pipe(
          catchError(error => {
            return of();
          })
        );
  }
  ListarTexturasuelocien(): Observable<Texturas[]>{
    return this.http.get<Texturas[]>(this.API+'/Texturas/'+"ListarTexturasuelocien").pipe(
          catchError(error => {
            return of();
          })
        );
  }
  ListarTexturasuelodoscientos(): Observable<Texturas[]>{
    return this.http.get<Texturas[]>(this.API+'/Texturas/'+"ListarTexturasuelodoscientos").pipe(
          catchError(error => {
            return of();
          })
        );
  }
}
