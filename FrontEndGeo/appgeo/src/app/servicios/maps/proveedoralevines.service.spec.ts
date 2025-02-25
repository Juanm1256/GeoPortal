import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProveedoralevinesService } from './proveedoralevines.service';

describe('ProveedoralevinesService', () => {
  let service: ProveedoralevinesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProveedoralevinesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
