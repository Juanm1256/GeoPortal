import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CapitalesDepartamentalesService } from './capitales-departamentales.service';

describe('CapitalesDepartamentalesService', () => {
  let service: CapitalesDepartamentalesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]  // Se agrega para proporcionar HttpClient
    });
    service = TestBed.inject(CapitalesDepartamentalesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
