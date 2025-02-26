import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UsuariosComponent } from './usuarios.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { UsuariosService } from '../../servicios/usuarios.service';
import { RolesService } from '../../servicios/roles.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ThemeService } from '../../servicios/theme.service';
import { of } from 'rxjs';
import Swal from 'sweetalert2';
import { Usuarios } from '../../interfaces/usuarios';
import { Roles } from '../../interfaces/roles';

describe('ComponenteUsuarios', () => {
  let componente: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;
  let servicioUsuarios: jasmine.SpyObj<UsuariosService>;
  let servicioRoles: jasmine.SpyObj<RolesService>;
  let servicioModal: jasmine.SpyObj<NgbModal>;
  let servicioTema: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    servicioUsuarios = jasmine.createSpyObj('UsuariosService', {
      ListarTodos: of([]),
      PostUsuario: jasmine.createSpy('PostUsuario'),
      PutUsuario: jasmine.createSpy('PutUsuario')
    });

    servicioRoles = jasmine.createSpyObj('RolesService', {
      ListarTodos: of([])
    });

    servicioModal = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);
    servicioTema = jasmine.createSpyObj('ThemeService', ['toggleTheme'], { isDarkMode$: of(false) });

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, UsuariosComponent],
      providers: [
        FormBuilder,
        { provide: UsuariosService, useValue: servicioUsuarios },
        { provide: RolesService, useValue: servicioRoles },
        { provide: NgbModal, useValue: servicioModal },
        { provide: ThemeService, useValue: servicioTema }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(UsuariosComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(Swal, 'fire').and.callFake(() => Promise.resolve() as any);
  });

  it('Debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('Debe cargar los usuarios y roles al inicializarse', async () => {
    const usuariosMock: Usuarios[] = [
      {
        idusuario: 1,
        username: 'usuario1',
        password_hash: 'hash123',
        idrol: 1,
        fechareg: new Date(),
        estado: 'Activo'
      }
    ];

    const rolesMock: Roles[] = [{ idrol: 1, nombre: 'Administrador', estado: 'Activo' }];

    servicioUsuarios.ListarTodos.and.returnValue(of(usuariosMock));
    servicioRoles.ListarTodos.and.returnValue(of(rolesMock));

    await componente.ngOnInit();

    expect(componente.listaUsuarios).toEqual(usuariosMock);
    expect(componente.roles).toEqual(rolesMock);
  });

  it('Debe alternar la visibilidad de la contraseña', () => {
    expect(componente.showPassword).toBeFalse();
    componente.togglePasswordVisibility();
    expect(componente.showPassword).toBeTrue();
  });

  it('Debe insertar un nuevo usuario', async () => {
    const usuarioMock: Usuarios = {
      idusuario: 1,
      username: 'usuario1',
      password_hash: 'hash123',
      idrol: 1,
      fechareg: new Date(),
      estado: 'Activo'
    };

    servicioUsuarios.PostUsuario.and.returnValue(of(usuarioMock));

    componente.form.patchValue({
      idrol: 1,
      username: 'usuario1',
      password: 'Contraseña1',
      nombres: 'Juan',
      apellidos: 'Perez',
      ci: '123456'
    });

    await componente.Guardar();

    expect(servicioUsuarios.PostUsuario).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success', title: 'Usuario Registrado!' }));
  });

  it('Debe actualizar un usuario existente', async () => {
    const usuarioMock: Usuarios = {
      idusuario: 1,
      username: 'usuario1',
      password_hash: 'hash123',
      idrol: 1,
      fechareg: new Date(),
      estado: 'Activo'
    };

    servicioUsuarios.PutUsuario.and.returnValue(of(usuarioMock));

    componente.id = 1;
    componente.form.patchValue({
      idrol: 1,
      username: 'usuario1',
      password: 'Contraseña1',
      nombres: 'Juan',
      apellidos: 'Perez',
      ci: '123456'
    });

    await componente.Guardar();

    expect(servicioUsuarios.PutUsuario).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success', title: 'Usuario Modificado!' }));
  });

  it('Debe seleccionar un usuario', async () => {
    const usuarioMock: Usuarios = {
      idusuario: 1,
      username: 'usuario1',
      password_hash: 'hash123',
      idrol: 1,
      fechareg: new Date(),
      estado: 'Activo',
      IdPersonanav: {
        idpersona: 1,
        nombres: 'Juan',
        apellidos: 'Perez',
        ci: '123456',
        fechareg: new Date(),
        estado: 'Activo'
      }
    };

    servicioModal.open.and.returnValue({ result: Promise.resolve() } as any);

    await componente.SeleccionarUsuario('contenido', usuarioMock);

    componente.form.get('nombres')?.setValue(componente.form.get('nombres')?.value.toUpperCase());
    componente.form.get('apellidos')?.setValue(componente.form.get('apellidos')?.value.toUpperCase());

    expect(componente.form.value.username).toBe('usuario1');
    expect(componente.form.value.nombres).toBe('JUAN');
    expect(componente.form.value.apellidos).toBe('PEREZ');
  });

  it('Debe cambiar el estado de un usuario', async () => {
    const usuarioMock: Usuarios = {
      idusuario: 1,
      username: 'usuario1',
      password_hash: 'hash123',
      idrol: 1,
      fechareg: new Date(),
      estado: 'Activo'
    };

    servicioUsuarios.PutUsuario.and.returnValue(of(usuarioMock));

    await componente.CambiarEstado(usuarioMock, 'Inactivo');

    expect(servicioUsuarios.PutUsuario).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error', title: 'El usuario ha sido desactivado!' }));
  });

  it('Debe limpiar el campo de búsqueda', () => {
    componente.search = 'prueba';
    componente.LimpiarSearch();
    expect(componente.search).toBe('');
  });

  it('Debe desuscribirse al destruirse', () => {
    spyOn(componente.themeSubscription, 'unsubscribe');
    componente.ngOnDestroy();
    expect(componente.themeSubscription.unsubscribe).toHaveBeenCalled();
  });
});
