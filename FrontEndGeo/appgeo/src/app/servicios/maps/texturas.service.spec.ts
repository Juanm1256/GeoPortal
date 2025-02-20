import { TestBed } from '@angular/core/testing';

import { TexturasService } from './texturas.service';

describe('TexturasService', () => {
  let service: TexturasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TexturasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
