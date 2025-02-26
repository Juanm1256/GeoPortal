import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LimitesMunicipalesService } from './limites-municipales.service';
import { LimitesMunicipales } from '../../interfaces/limites-municipales';

describe('LimitesMunicipalesService', () => {
  let service: LimitesMunicipalesService;
  let httpMock: HttpTestingController;
  const API_URL = 'https://localhost:7297/api/Limites_Municipales/ListarTodos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LimitesMunicipalesService]
    });

    service = TestBed.inject(LimitesMunicipalesService);
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

  it('Debe retornar un array de límites municipales cuando la solicitud es exitosa', () => {
    const mockData: LimitesMunicipales[] = [
      {
        gid: 1,
        objectid: 12345,
        dep: 'La Paz',
        prov: 'Murillo',
        mun: 'La Paz',
        cod_dep: '02',
        cod_prov: '01',
        cod_Mun: '001',
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
