import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CuencasService } from './cuencas.service';
import { Cuencas } from '../../interfaces/cuencas';

describe('CuencasService', () => {
  let service: CuencasService;
  let httpMock: HttpTestingController;
  const API_URL = 'https://localhost:7297/api/Cuencas/ListarTodos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CuencasService]
    });
    service = TestBed.inject(CuencasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe realizar una solicitud GET a la URL correcta', () => {
    service.listarTodos().subscribe();
    
    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
  });

  it('Debe devolver un array de cuencas cuando la solicitud es exitosa', () => {
    const mockCuencas: Cuencas[] = [
      { gid: 1, sup_km2: 5000, cuenca: 'Cuenca A', geom: {} },
      { gid: 2, sup_km2: 3200, cuenca: 'Cuenca B', geom: {} }
    ];

    service.listarTodos().subscribe((cuencas) => {
      expect(cuencas.length).toBe(2);
      expect(cuencas).toEqual(mockCuencas);
    });

    const req = httpMock.expectOne(API_URL);
    req.flush(mockCuencas);
  });

  it('Debe manejar un error en la solicitud y devolver un array vacío', () => {
    service.listarTodos().subscribe((cuencas) => {
      expect(cuencas).toEqual([]);
    });

    const req = httpMock.expectOne(API_URL);
    req.error(new ErrorEvent('Error de red'));
  });

});
