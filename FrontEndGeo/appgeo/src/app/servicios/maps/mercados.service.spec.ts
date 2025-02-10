import { TestBed } from '@angular/core/testing';

import { MercadosService } from './mercados.service';

describe('MercadosService', () => {
  let service: MercadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MercadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
