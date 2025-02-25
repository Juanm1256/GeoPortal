import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProveedorasistenciatecnicaService } from './proveedorasistenciatecnica.service';

describe('ProveedorasistenciatecnicaService', () => {
  let service: ProveedorasistenciatecnicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProveedorasistenciatecnicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
