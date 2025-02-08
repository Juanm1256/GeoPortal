import { TestBed } from '@angular/core/testing';

import { RolesPermisoService } from './roles-permiso.service';

describe('RolesPermisoService', () => {
  let service: RolesPermisoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesPermisoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
