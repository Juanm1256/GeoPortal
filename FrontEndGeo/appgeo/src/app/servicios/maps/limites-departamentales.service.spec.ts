import { TestBed } from '@angular/core/testing';

import { LimitesDepartamentalesService } from './limites-departamentales.service';

describe('LimitesDepartamentalesService', () => {
  let service: LimitesDepartamentalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LimitesDepartamentalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
