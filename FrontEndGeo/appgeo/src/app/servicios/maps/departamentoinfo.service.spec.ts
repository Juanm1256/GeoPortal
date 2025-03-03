import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DepartamentoinfoService } from './departamentoinfo.service';
import { DepartamentoInforDTO } from '../../interfaces/departamento-infor-dto';

describe('DepartamentoinfoService', () => {
  let service: DepartamentoinfoService;
  let httpMock: HttpTestingController;
  const API_URL = 'https://localhost:7297/api/Departamento/informacion';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DepartamentoinfoService]
    });
    service = TestBed.inject(DepartamentoinfoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crearse el servicio', () => {
    expect(service).toBeTruthy();
  });

  it('Debe realizar una solicitud GET con los parámetros de longitud y latitud', () => {
    const longitud = -63.1821;
    const latitud = -17.7833;

    service.obtenerInformacionDepartamento(longitud, latitud).subscribe();

    const req = httpMock.expectOne(
      (request) => request.url === API_URL && 
      request.params.get('longitud') === longitud.toString() &&
      request.params.get('latitud') === latitud.toString()
    );
    
    expect(req.request.method).toBe('GET');
  });
  it('Debe manejar un error en la solicitud y devolver un array vacío', () => {
    service.obtenerInformacionDepartamento(-63.1821, -17.7833).subscribe(
      (data) => {
        expect(data).toEqual([]);
      },
      (error) => {
        expect(error).toBeTruthy();
      }
    );

    const req = httpMock.expectOne((request) => request.url.includes(API_URL));
    req.error(new ErrorEvent('Error de red'));
  });

});
