import { TestBed } from '@angular/core/testing';

import { DepartamentoinfoService } from './departamentoinfo.service';

describe('DepartamentoinfoService', () => {
  let service: DepartamentoinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DepartamentoinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
