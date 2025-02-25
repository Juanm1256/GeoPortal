import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TexturasService } from './texturas.service';

describe('TexturasService', () => {
  let service: TexturasService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TexturasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
