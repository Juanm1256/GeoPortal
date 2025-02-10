import { TestBed } from '@angular/core/testing';

import { CapitalesDepartamentalesService } from './capitales-departamentales.service';

describe('CapitalesDepartamentalesService', () => {
  let service: CapitalesDepartamentalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CapitalesDepartamentalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
