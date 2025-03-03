import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TexturasService } from './texturas.service';
import { Texturas } from '../../interfaces/texturas';

describe('TexturasService', () => {
  let service: TexturasService;
  let httpMock: HttpTestingController;
  const API_URL = 'https://localhost:7297/api/Texturas';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TexturasService]
    });

    service = TestBed.inject(TexturasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  const testCases = [
    { method: () => service.ListarTexturasuelocero(), endpoint: 'ListarTexturasuelocero' },
    { method: () => service.ListarTexturasuelodiez(), endpoint: 'ListarTexturasuelodiez' },
    { method: () => service.ListarTexturasuelotreinta(), endpoint: 'ListarTexturasuelotreinta' },
    { method: () => service.ListarTexturasuelosesenta(), endpoint: 'ListarTexturasuelosesenta' },
    { method: () => service.ListarTexturasuelocien(), endpoint: 'ListarTexturasuelocien' },
    { method: () => service.ListarTexturasuelodoscientos(), endpoint: 'ListarTexturasuelodoscientos' }
  ];

  testCases.forEach(({ method, endpoint }) => {
    it(`Debe realizar una solicitud GET a ${endpoint}`, () => {
      method().subscribe();

      const req = httpMock.expectOne(`${API_URL}/${endpoint}`);
      expect(req.request.method).toBe('GET');
    });

    it(`Debe retornar un array de texturas cuando la solicitud a ${endpoint} es exitosa`, () => {
      const mockData: Texturas[] = [{ Value: 1, Porcentaje: 45.5 }];

      method().subscribe((data: Texturas[]) => {
        expect(data.length).toBe(1);
        expect(data).toEqual(mockData);
      });

      const req = httpMock.expectOne(`${API_URL}/${endpoint}`);
      req.flush(mockData);
    });

    it(`Debe manejar un error en la solicitud a ${endpoint} y devolver un error`, () => {
      method().subscribe(
        () => fail('Se esperaba un error, pero la solicitud fue exitosa'),
        (error) => {
          expect(error).toBeTruthy();
          expect(error.message).toBe('Error en la petición al servidor');
        }
      );

      const req = httpMock.expectOne(`${API_URL}/${endpoint}`);
      req.error(new ErrorEvent('Error de red'));
    });
  });

});
