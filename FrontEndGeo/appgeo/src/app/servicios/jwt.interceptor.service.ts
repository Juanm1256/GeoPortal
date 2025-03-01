import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { catchError, EMPTY } from 'rxjs';

const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (req.url.includes('/Login')) {
    return next(req);
  }

  const token = authService.getToken();
  if (!token) {
    return next(req);
  }

  if (authService.isTokenExpired()) {
    authService.logout();
    router.navigate(['/login']);
    return EMPTY;
  }

  const clonedRequest = req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  });

  return next(clonedRequest).pipe(
    catchError((error) => {
      if (error.status === 401) {
        authService.logout();
        setTimeout(() => router.navigate(['/login']), 0);
        return EMPTY;
      }
      return EMPTY;
    })
  );
};

export default jwtInterceptor;
