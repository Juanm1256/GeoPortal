import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = authService.getToken();

  if (!token) {
    console.warn('⚠ No hay token disponible, enviando solicitud sin autenticación.');
    return next(req);
  }

  // ✅ Verificar si el token ha expirado
  if (authService.isTokenExpired()) {
    console.warn('⛔ El token ha expirado, redirigiendo al login...');
    authService.logout();
    router.navigate(['/login']);
    return next(req);
  }

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedRequest);
};

export default jwtInterceptor;
