import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LimitesDepartamentalesService } from './limites-departamentales.service';
import { LimitesDepartamentales } from '../../interfaces/limites-departamentales';

describe('LimitesDepartamentalesService', () => {
  let service: LimitesDepartamentalesService;
  let httpMock: HttpTestingController;
  const API_URL = 'https://localhost:7297/api/Limites_Departamentales/ListarTodos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LimitesDepartamentalesService]
    });

    service = TestBed.inject(LimitesDepartamentalesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya solicitudes pendientes
  });

  it('Debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe realizar una solicitud GET a la API correcta', () => {
    service.listarTodos().subscribe();

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
  });

  it('Debe retornar un array de límites departamentales cuando la solicitud es exitosa', () => {
    const mockData: LimitesDepartamentales[] = [
      {
        gid: 1,
        dep: 'Santa Cruz',
        cod_dep: '07',
        shape_leng: 12000.5,
        shape_area: 560000.3,
        geom: {}
      }
    ];

    service.listarTodos().subscribe((data) => {
      expect(data.length).toBe(1);
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(API_URL);
    req.flush(mockData);
  });

  it('Debe manejar un error en la solicitud y devolver un array vacío', () => {
    service.listarTodos().subscribe(
      (data) => {
        expect(data).toEqual([]);
      },
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne(API_URL);
    req.error(new ErrorEvent('Error de red'));
  });

});
