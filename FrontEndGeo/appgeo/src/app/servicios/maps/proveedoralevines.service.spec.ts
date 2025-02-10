import { TestBed } from '@angular/core/testing';

import { ProveedoralevinesService } from './proveedoralevines.service';

describe('ProveedoralevinesService', () => {
  let service: ProveedoralevinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProveedoralevinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
