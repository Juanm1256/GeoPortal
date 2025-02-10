import { TestBed } from '@angular/core/testing';

import { LimitesMunicipalesService } from './limites-municipales.service';

describe('LimitesMunicipalesService', () => {
  let service: LimitesMunicipalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LimitesMunicipalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
