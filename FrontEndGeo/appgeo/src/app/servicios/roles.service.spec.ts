import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RolesService } from './roles.service';
import { Roles } from '../interfaces/roles';
import { Permisos } from '../interfaces/permisos';

describe('RolesService', () => {
  let service: RolesService;
  let httpMock: HttpTestingController;

  const dummyRoles: Roles[] = [
    { idrol: 1, nombre: 'Administrador', estado: 'A', permisos: ['Crear', 'Editar'] },
    { idrol: 2, nombre: 'Usuario', estado: 'I', permisos: ['Ver'] }
  ];

  const dummyPermisos: Permisos[] = [
    { idpermiso: 1, nombre: 'Crear' },
    { idpermiso: 2, nombre: 'Editar' },
    { idpermiso: 3, nombre: 'Ver' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RolesService]
    });

    service = TestBed.inject(RolesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya peticiones pendientes
  });

  it('Debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('Debe obtener todos los roles', () => {
    service.ListarTodos().subscribe(roles => {
      expect(roles.length).toBe(2);
      expect(roles).toEqual(dummyRoles);
    });

    const req = httpMock.expectOne(`${service['API']}/Roles/ListarTodos`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyRoles);
  });

  it('Debe obtener todos los permisos', () => {
    service.ListarPermiso().subscribe(permisos => {
      expect(permisos.length).toBe(3);
      expect(permisos).toEqual(dummyPermisos);
    });

    const req = httpMock.expectOne(`${service['API']}/Roles/ListarPermisos`);
    expect(req.request.method).toBe('GET');
    req.flush(dummyPermisos);
  });

  it('Debe obtener roles con permisos activos', () => {
    service.ListarRolPermisoActivos().subscribe(roles => {
      expect(roles.length).toBe(1);
      expect(roles[0].estado).toBe('A');
    });

    const req = httpMock.expectOne(`${service['API']}/Rol_Permiso/ListarActivos`);
    expect(req.request.method).toBe('GET');
    req.flush([dummyRoles[0]]);
  });

  it('Debe agregar un nuevo rol', () => {
    const newRole: Roles = { idrol: 3, nombre: 'Supervisor', estado: 'A', permisos: ['Ver', 'Editar'] };

    service.PostRol(newRole).subscribe(response => {
      expect(response).toEqual(newRole);
    });

    const req = httpMock.expectOne(`${service['API']}/Roles/Insertar`);
    expect(req.request.method).toBe('POST');
    req.flush(newRole);
  });

  it('Debe eliminar un rol', () => {
    service.DeleteRol(dummyRoles[0].idrol!).subscribe(response => {
      expect(response).toBeTruthy();
    });

    const req = httpMock.expectOne(`${service['API']}/Roles/${dummyRoles[0].idrol}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('Debe manejar errores correctamente en ListarTodos', () => {
    service.ListarTodos().subscribe(roles => {
      expect(roles.length).toBe(0); // Debe retornar un array vacío en caso de error
    });

    const req = httpMock.expectOne(`${service['API']}/Roles/ListarTodos`);
    req.error(new ErrorEvent('Error de red'));
  });
});
