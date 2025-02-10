import { TestBed } from '@angular/core/testing';

import { ProveedorasistenciatecnicaService } from './proveedorasistenciatecnica.service';

describe('ProveedorasistenciatecnicaService', () => {
  let service: ProveedorasistenciatecnicaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProveedorasistenciatecnicaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
