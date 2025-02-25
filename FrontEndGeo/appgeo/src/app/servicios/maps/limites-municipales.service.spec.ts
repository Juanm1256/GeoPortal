import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LimitesMunicipalesService } from './limites-municipales.service';

describe('LimitesMunicipalesService', () => {
  let service: LimitesMunicipalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(LimitesMunicipalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
