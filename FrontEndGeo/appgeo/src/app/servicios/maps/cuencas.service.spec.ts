import { TestBed } from '@angular/core/testing';

import { CuencasService } from './cuencas.service';

describe('CuencasService', () => {
  let service: CuencasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CuencasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
