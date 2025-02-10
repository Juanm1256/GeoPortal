import { TestBed } from '@angular/core/testing';

import { ProveedoralimentosService } from './proveedoralimentos.service';

describe('ProveedoralimentosService', () => {
  let service: ProveedoralimentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProveedoralimentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
