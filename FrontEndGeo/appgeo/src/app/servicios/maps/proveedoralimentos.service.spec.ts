import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ProveedoralimentosService } from './proveedoralimentos.service';

describe('ProveedoralimentosService', () => {
  let service: ProveedoralimentosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProveedoralimentosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
