import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DepartamentoinfoService } from './departamentoinfo.service';

describe('DepartamentoinfoService', () => {
  let service: DepartamentoinfoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(DepartamentoinfoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
