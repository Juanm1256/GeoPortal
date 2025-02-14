import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Login } from '../interfaces/login';

interface LoginResponse {
  Expira: Date;
  Token: string;
  
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7297/api/Auth';

  constructor(
    private http: HttpClient,
    private router: Router) {}

  login(credentials: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login`, credentials);
  }

  logout(): void {
    //console.log(' Cerrando sesión y eliminando token...');
    localStorage.removeItem('Token');
    this.router.navigate(['/login']);
  }

  saveToken(token: string | null): void {
    if (!token || token === 'undefined') {
      //console.error('❌ Error: Token JWT no recibido o es inválido');
      return;
    }
  
    localStorage.setItem('Token', token);
    //console.log('🔹 Token guardado en localStorage:', token);
  
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      //console.log('🔹 Payload del token:', payload);
  
      if (payload.Permiso) {
        if (typeof payload.Permiso === 'string') {
          localStorage.setItem('permissions', JSON.stringify(payload.Permiso.split(',')));
        } else if (Array.isArray(payload.Permiso)) {
          localStorage.setItem('permissions', JSON.stringify(payload.Permiso));
        } else {
          //console.warn('⚠️ Advertencia: Permiso no es una cadena ni un array:', payload.Permiso);
        }
      } else {
        //console.warn('⚠️ Advertencia: El token no contiene permisos');
      }
  
    } catch (error) {
      //console.error('❌ Error al decodificar el token:', error);
    }
  }
  

  getToken(): string | null {
    const token = localStorage.getItem('Token');
    //console.log(' Obteniendo token desde localStorage:', token);
    return token;
  }
}
