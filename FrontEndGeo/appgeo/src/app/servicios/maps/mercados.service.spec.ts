import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MercadosService } from './mercados.service';
import { Mercados } from '../../interfaces/mercados';

describe('MercadosService', () => {
  let service: MercadosService;
  let httpMock: HttpTestingController;
  const API_URL = 'https://localhost:7297/api/Mercados/ListarTodos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MercadosService]
    });

    service = TestBed.inject(MercadosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe realizar una solicitud GET a la API correcta', () => {
    service.listarTodos().subscribe();

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
  });

  it('Debe retornar un array de mercados cuando la solicitud es exitosa', () => {
    const mockData: Mercados[] = [
      {
        gid: 1,
        ogc_fid: 100,
        departmen: 'Santa Cruz',
        provincia: 'Andrés Ibáñez',
        municipio: 'Santa Cruz de la Sierra',
        ciudad: 'Santa Cruz',
        nombre: 'Mercado La Ramada',
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
