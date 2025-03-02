import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import {jwtDecode} from 'jwt-decode';
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

  login(credentials: Login): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/Login`, credentials).pipe(
      tap(response => {
        this.saveToken(response.Token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('Token');
    localStorage.removeItem('userRole'); 
    localStorage.removeItem('permissions');
    this.router.navigate(['/login']); 
  }

  saveToken(token: string | null): void {
    if (!token || token === 'undefined') return;

    localStorage.setItem('Token', token);
    try {
      const payload: any = jwtDecode(token);

      if (payload.Rol) {
        localStorage.setItem('userRole', payload.Rol);
      }

      if (payload.Permiso) {
        if (typeof payload.Permiso === 'string') {
          localStorage.setItem('permissions', JSON.stringify(payload.Permiso.split(',')));
        } else if (Array.isArray(payload.Permiso)) {
          localStorage.setItem('permissions', JSON.stringify(payload.Permiso));
        }
      }
    } catch (error) {
    }
  }

  getToken(): string | null {
  const token = localStorage.getItem('Token');
  return token && token !== 'undefined' ? token : null;
}

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  getPermissions(): string[] {
    const permisos = localStorage.getItem('permissions');
    return permisos ? JSON.parse(permisos) : [];
  }

  getTokenExpiration(): number | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payload: any = jwtDecode(token);
      return payload.exp * 1000;
    } catch (error) {
      return null;
    }
  }

  isTokenExpired(): boolean {
    const exp = this.getTokenExpiration();
    if (!exp) return true;
    return Date.now() > exp;
  }
}
