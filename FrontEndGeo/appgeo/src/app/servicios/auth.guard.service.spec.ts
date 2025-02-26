import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard.service';
import { AuthService } from './auth.service';

describe('AuthGuard', () => {
  let authGuard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    authService = jasmine.createSpyObj('AuthService', ['getToken', 'getUserRole', 'isTokenExpired']);
    router = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    authGuard = TestBed.inject(AuthGuard);
  });

  it('Debe ser creado', () => {
    expect(authGuard).toBeTruthy();
  });

  it('Debe permitir el acceso si el token es válido y el usuario es administrador', () => {
    authService.getToken.and.returnValue('valid-token');
    authService.isTokenExpired.and.returnValue(false);
    authService.getUserRole.and.returnValue('ADMINISTRADOR');

    expect(authGuard.canActivate()).toBeTrue();
  });

  it('Debe redirigir al login si no hay token', () => {
    authService.getToken.and.returnValue(null);

    expect(authGuard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('Debe redirigir al login si el token ha expirado', () => {
    authService.getToken.and.returnValue('expired-token');
    authService.isTokenExpired.and.returnValue(true);

    expect(authGuard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('Debe redirigir al mapa público si el usuario no es administrador', () => {
    authService.getToken.and.returnValue('valid-token');
    authService.isTokenExpired.and.returnValue(false);
    authService.getUserRole.and.returnValue('VISITANTE');

    expect(authGuard.canActivate()).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/map-public']);
  });
});
