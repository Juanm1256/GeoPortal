import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CapitalesDepartamentalesService } from './capitales-departamentales.service';
import { CapitalesDepartamentales } from '../../interfaces/capitales-departamentales';

describe('CapitalesDepartamentalesService', () => {
  let service: CapitalesDepartamentalesService;
  let httpMock: HttpTestingController;

  const mockCapitales: CapitalesDepartamentales[] = [
    { gid: 1, objectid: 101, cap_dep: 'La Paz', cod_ine: '01', geom: {} },
    { gid: 2, objectid: 102, cap_dep: 'Cochabamba', cod_ine: '02', geom: {} }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CapitalesDepartamentalesService]
    });

    service = TestBed.inject(CapitalesDepartamentalesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe listar todas las capitales departamentales', () => {
    service.listarTodos().subscribe((capitales) => {
      expect(capitales.length).toBe(2);
      expect(capitales).toEqual(mockCapitales);
    });

    const req = httpMock.expectOne(`${service['API']}/ListarTodos`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCapitales);
  });

  it('Debe manejar errores al listar todas las capitales departamentales', () => {
    service.listarTodos().subscribe((capitales) => {
      expect(capitales).toEqual([]);
    });

    const req = httpMock.expectOne(`${service['API']}/ListarTodos`);
    req.error(new ErrorEvent('Network error'));
  });
});
