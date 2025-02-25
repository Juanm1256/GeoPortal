import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode'; // ✅ Asegúrate de instalarlo: `npm install jwt-decode`
import { Login } from '../interfaces/login';
import { tap } from 'rxjs/operators';
import { LoginResponse } from '../interfaces/login-response';

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
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login`, credentials).pipe(
      tap(response => {
        //console.log('🔍 Respuesta del backend:', response);
        this.saveToken(response.Token);
      })
    );
  }

  // ✅ Método para cerrar sesión
  logout(): void {
    //console.warn('🔴 Cerrando sesión...');
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

      console.log("Este es el token para las pruebas de estres"+token);
    } catch (error) {
      //console.error('❌ Error al decodificar el token:', error);
    }
  }

  // ✅ Obtener el token del localStorage
  getToken(): string | null {
  const token = localStorage.getItem('Token');
  return token && token !== 'undefined' ? token : null;
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
      //console.log('🔍 Expiración del token:', new Date(payload.exp * 1000));
      return payload.exp * 1000; // Devuelve la fecha de expiración en milisegundos
    } catch (error) {
      //console.error('❌ Error al decodificar el token:', error);
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
