import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProveedoralevinesService } from './proveedoralevines.service';
import { ProveedorAlevines } from '../../interfaces/proveedor-alevines';

describe('ProveedoralevinesService', () => {
  let service: ProveedoralevinesService;
  let httpMock: HttpTestingController;
  const API_URL = 'https://localhost:7297/api/ProveedorAlevines/ListarTodos';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProveedoralevinesService]
    });

    service = TestBed.inject(ProveedoralevinesService);
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

  it('Debe retornar un array de proveedores de alevines cuando la solicitud es exitosa', () => {
    const mockData: ProveedorAlevines[] = [
      {
        gid: 1,
        name: 'Proveedor 1',
        x: -63.1821,
        y: -17.7833,
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
