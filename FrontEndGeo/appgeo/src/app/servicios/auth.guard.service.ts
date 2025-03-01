import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const token = this.authService.getToken();
    const userRole = this.authService.getUserRole();

    if (!token || this.authService.isTokenExpired()) {
      this.router.navigate(['/login']);
      return false;
    }

    if (userRole !== 'ADMINISTRADOR') {
      this.router.navigate(['/map-public']);
      return false;
    }

    return true;
  }
}
