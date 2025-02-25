import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CuencasService } from './cuencas.service';

describe('CuencasService', () => {
  let service: CuencasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(CuencasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
