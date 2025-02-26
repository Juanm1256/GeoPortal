import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UsuariosService } from './usuarios.service';
import { Usuarios } from '../interfaces/usuarios';

describe('Servicio de Usuarios', () => {
  let servicio: UsuariosService;
  let httpMock: HttpTestingController;

  const usuariosPrueba: Usuarios[] = [
    { idusuario: 1, idpersona: 101, username: 'usuario1', password_hash: '12345', idrol: 2, fechareg: new Date(), estado: 'A' },
    { idusuario: 2, idpersona: 102, username: 'usuario2', password_hash: '67890', idrol: 3, fechareg: new Date(), estado: 'I' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UsuariosService]
    });

    servicio = TestBed.inject(UsuariosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifica que no haya peticiones pendientes
  });

  it('debería crearse correctamente', () => {
    expect(servicio).toBeTruthy();
  });

  it('debería obtener todos los usuarios', () => {
    servicio.ListarTodos().subscribe(usuarios => {
      expect(usuarios.length).toBe(2);
      expect(usuarios).toEqual(usuariosPrueba);
    });

    const req = httpMock.expectOne(`${servicio['API']}/ListarTodos`);
    expect(req.request.method).toBe('GET');
    req.flush(usuariosPrueba);
  });

  it('debería obtener solo los usuarios activos', () => {
    servicio.ListarActivos().subscribe(usuarios => {
      expect(usuarios.length).toBe(1);
      expect(usuarios[0].estado).toBe('A');
    });

    const req = httpMock.expectOne(`${servicio['API']}/ListarActivos`);
    expect(req.request.method).toBe('GET');
    req.flush([usuariosPrueba[0]]); // Solo retorna el usuario activo
  });

  it('debería agregar un nuevo usuario', () => {
    const nuevoUsuario: Usuarios = { idusuario: 3, idpersona: 103, username: 'usuario3', password_hash: 'abcde', idrol: 1, fechareg: new Date(), estado: 'A' };

    servicio.PostUsuario(nuevoUsuario).subscribe(respuesta => {
      expect(respuesta).toEqual(nuevoUsuario);
    });

    const req = httpMock.expectOne(`${servicio['API']}/Insertar`);
    expect(req.request.method).toBe('POST');
    req.flush(nuevoUsuario);
  });

  it('debería actualizar un usuario existente', () => {
    const usuarioModificado: Usuarios = { ...usuariosPrueba[0], username: 'usuario_modificado' };

    servicio.PutUsuario(usuarioModificado.idusuario, usuarioModificado).subscribe(respuesta => {
      expect(respuesta.username).toBe('usuario_modificado');
    });

    const req = httpMock.expectOne(`${servicio['API']}/Modificar/${usuarioModificado.idusuario}`);
    expect(req.request.method).toBe('PUT');
    req.flush(usuarioModificado);
  });

  it('debería eliminar un usuario', () => {
    servicio.DeleteUsuario(usuariosPrueba[0].idusuario).subscribe(respuesta => {
      expect(respuesta).toBeTruthy();
    });

    const req = httpMock.expectOne(`${servicio['API']}/${usuariosPrueba[0].idusuario}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('debería manejar errores correctamente', () => {
    servicio.ListarTodos().subscribe(usuarios => {
      expect(usuarios.length).toBe(0); // Debe retornar un array vacío en caso de error
    });

    const req = httpMock.expectOne(`${servicio['API']}/ListarTodos`);
    req.error(new ErrorEvent('Error de red'));
  });
});
