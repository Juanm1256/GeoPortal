import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { Login } from '../interfaces/login';
import { LoginResponse } from '../interfaces/login-response';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{ provide: Router, useValue: routerSpy }]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    localStorage.clear(); // Limpiar almacenamiento antes de cada prueba
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe iniciar sesión y almacenar el token', () => {
    const mockCredentials: Login = {
      Username: 'usuario',
      Password: 'password123',
      RefrescarToken: false
    };

    const mockResponse: LoginResponse = {
      Expira: new Date(),
      Token: 'mock.jwt.token'
    };

    service.login(mockCredentials).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${service['apiUrl']}/Login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    expect(localStorage.getItem('Token')).toBe(mockResponse.Token);
  });

  it('Debe cerrar sesión y limpiar el almacenamiento', () => {
    localStorage.setItem('Token', 'mock.jwt.token');
    localStorage.setItem('userRole', 'ADMIN');
    localStorage.setItem('permissions', JSON.stringify(['READ', 'WRITE']));

    service.logout();

    expect(localStorage.getItem('Token')).toBeNull();
    expect(localStorage.getItem('userRole')).toBeNull();
    expect(localStorage.getItem('permissions')).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('Debe obtener el token almacenado', () => {
    localStorage.setItem('Token', 'mock.jwt.token');
    expect(service.getToken()).toBe('mock.jwt.token');
  });

  it('Debe devolver null si el token no está almacenado', () => {
    expect(service.getToken()).toBeNull();
  });

  it('Debe obtener el rol del usuario', () => {
    localStorage.setItem('userRole', 'ADMIN');
    expect(service.getUserRole()).toBe('ADMIN');
  });

  it('Debe obtener los permisos del usuario', () => {
    localStorage.setItem('permissions', JSON.stringify(['READ', 'WRITE']));
    expect(service.getPermissions()).toEqual(['READ', 'WRITE']);
  });

  it('Debe detectar si el token ha expirado', () => {
    spyOn(service, 'getTokenExpiration').and.returnValue(Date.now() - 1000);
    expect(service.isTokenExpired()).toBeTrue();
  });

  it('Debe detectar si el token es válido (no ha expirado)', () => {
    spyOn(service, 'getTokenExpiration').and.returnValue(Date.now() + 10000);
    expect(service.isTokenExpired()).toBeFalse();
  });

});
