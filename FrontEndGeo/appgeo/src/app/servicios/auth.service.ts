import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode'; // ✅ Asegúrate de instalarlo: `npm install jwt-decode`
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
    private router: Router
  ) {}

  // ✅ Método para iniciar sesión
  login(credentials: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login`, credentials);
  }

  // ✅ Método para cerrar sesión
  logout(): void {
    console.warn('🔴 Cerrando sesión...');
    localStorage.removeItem('Token');
    localStorage.removeItem('userRole'); 
    localStorage.removeItem('permissions');
    this.router.navigate(['/login']); // ✅ Redirigir al login
  }

  // ✅ Guardar token y datos en localStorage
  saveToken(token: string | null): void {
    if (!token || token === 'undefined') return;

    localStorage.setItem('Token', token);
    try {
      const payload: any = jwtDecode(token);

      if (payload.Rol) {
        localStorage.setItem('userRole', payload.Rol); // ✅ Guardar rol del usuario
      }

      if (payload.Permiso) {
        if (typeof payload.Permiso === 'string') {
          localStorage.setItem('permissions', JSON.stringify(payload.Permiso.split(',')));
        } else if (Array.isArray(payload.Permiso)) {
          localStorage.setItem('permissions', JSON.stringify(payload.Permiso));
        }
      }

      console.log('✅ Token guardado correctamente');
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
    }
  }

  // ✅ Obtener el token del localStorage
  getToken(): string | null {
    return localStorage.getItem('Token');
  }

  // ✅ Obtener el rol del usuario
  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  // ✅ Obtener permisos del usuario
  getPermissions(): string[] {
    const permisos = localStorage.getItem('permissions');
    return permisos ? JSON.parse(permisos) : [];
  }

  // ✅ Obtener la fecha de expiración del token
  getTokenExpiration(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload: any = jwtDecode(token);
      console.log('🔍 Expiración del token:', new Date(payload.exp * 1000));
      return payload.exp * 1000; // Devuelve la fecha de expiración en milisegundos
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
      return null;
    }
  }

  // ✅ Verificar si el token ha expirado
  isTokenExpired(): boolean {
    const exp = this.getTokenExpiration();
    if (!exp) return true;
    return Date.now() > exp;
  }
}
