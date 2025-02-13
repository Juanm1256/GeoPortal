import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

interface LoginResponse {
  username: string;
  AccessToken: string;
  expireIn: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7297/api/Auth'; // Ajusta si es necesario

  constructor(
    private http: HttpClient,
    private router: Router) {}

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login`, credentials);
  }

  logout(): void {
    console.log('🔴 Cerrando sesión y eliminando token...');
    localStorage.removeItem('accessToken');
    localStorage.removeItem('permissions');

    this.router.navigate(['/login']); // ✅ Redirigir usando Angular Router
  }

  saveToken(token: string | null): void {
    if (!token || token === 'undefined') {
      console.error('Error: Token JWT no recibido o es inválido');
      return;
    }

    localStorage.setItem('accessToken', token);
    console.log('✅ Token guardado en localStorage:', token); // ✅ Debug

    try {
      const payload = JSON.parse(atob(token.split('.')[1])); // Decodificar el JWT
      if (payload.Permiso) {
        localStorage.setItem('permissions', JSON.stringify(payload.Permiso.split(',')));
      } else {
        console.warn('⚠ Advertencia: El token no contiene permisos');
      }
    } catch (error) {
      console.error('❌ Error al decodificar el token:', error);
    }
  }

  getToken(): string | null {
    const token = localStorage.getItem('accessToken');
    console.log('📥 Obteniendo token desde localStorage:', token); // ✅ Debug
    return token;
  }
}
