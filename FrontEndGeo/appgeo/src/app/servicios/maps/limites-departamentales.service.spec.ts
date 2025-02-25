import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LimitesDepartamentalesService } from './limites-departamentales.service';

describe('LimitesDepartamentalesService', () => {
  let service: LimitesDepartamentalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LimitesDepartamentalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
