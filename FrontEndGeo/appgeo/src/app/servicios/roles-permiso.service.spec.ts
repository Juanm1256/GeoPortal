import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RolesPermisoService } from './roles-permiso.service';
import { RolPermisoDTO } from '../interfaces/rol-permiso-dto';
import { RolPermiso } from '../interfaces/rol-permiso';

describe('RolesPermisoService', () => {
  let service: RolesPermisoService;
  let httpMock: HttpTestingController;

  const dummyRolPermisoDTO: RolPermisoDTO = {
    nombreRol: 'Administrador',
    estado: 'A',
    IdPermisos: [1, 2, 3]
  };

  const dummyRolPermisos: RolPermiso[] = [
    { idrolpermiso: 1, idrol: 1, idpermiso: 1, estado: 'A', IdRolnav: { idrol: 1, nombre: 'Administrador', estado: 'A' }, IdPermisonav: { idpermiso: 1, nombre: 'Crear' } },
    { idrolpermiso: 2, idrol: 2, idpermiso: 2, estado: 'I', IdRolnav: { idrol: 2, nombre: 'Usuario', estado: 'I' }, IdPermisonav: { idpermiso: 2, nombre: 'Editar' } }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RolesPermisoService]
    });

    service = TestBed.inject(RolesPermisoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('Debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('Debe insertar un nuevo rol con permisos', () => {
    service.insertar(dummyRolPermisoDTO).subscribe(response => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne(`${service['API']}/Insertar`);
    expect(req.request.method).toBe('POST');
    req.flush(true);
  });

  it('Debe obtener todos los roles con permisos', () => {
    service.listarTodos().subscribe(rolesPermiso => {
      expect(rolesPermiso.length).toBe(2);
      expect(rolesPermiso).toEqual(dummyRolPermisos);
    });

    const req = httpMock.expectOne(`${service['API']}/ListarTodos`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyRolPermisos);
  });

  it('Debe modificar un rol con permisos', () => {
    const nuevoRolPermisoDTO: RolPermisoDTO = {
      nombreRol: 'Usuario',
      estado: 'A',
      IdPermisos: [1, 3]
    };

    service.modificar(nuevoRolPermisoDTO, 'Usuario').subscribe(response => {
      expect(response).toBeTrue();
    });

    const req = httpMock.expectOne(`${service['API']}/Modificar/Usuario`);
    expect(req.request.method).toBe('PUT');
    req.flush(true);
  });

  it('Debe manejar errores correctamente en listarTodos', () => {
    service.listarTodos().subscribe(rolesPermiso => {
      expect(rolesPermiso.length).toBe(0);
    });

    const req = httpMock.expectOne(`${service['API']}/ListarTodos`);
    req.error(new ErrorEvent('Error de red'));
  });
});
