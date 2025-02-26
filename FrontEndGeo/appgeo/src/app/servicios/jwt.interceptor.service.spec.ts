import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import jwtInterceptor from './jwt.interceptor.service';
import { HttpClient } from '@angular/common/http';

describe('jwtInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])) // ✅ Agrega el interceptor en pruebas
      ]
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpMock.verify(); // ✅ Verifica que no haya solicitudes pendientes
  });

  it('Debe crearse correctamente', () => {
    expect(httpClient).toBeTruthy(); // ✅ Asegura que el `HttpClient` está disponible
  });

});
