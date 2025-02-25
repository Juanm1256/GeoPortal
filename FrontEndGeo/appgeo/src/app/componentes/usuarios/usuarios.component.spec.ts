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
import { Personas } from '../../interfaces/personas';
import { Roles } from '../../interfaces/roles';

// ✅ COMIENZO DE LAS PRUEBAS UNITARIAS

describe('UsuariosComponent', () => {
  let component: UsuariosComponent;
  let fixture: ComponentFixture<UsuariosComponent>;
  let usuarioService: jasmine.SpyObj<UsuariosService>;
  let rolService: jasmine.SpyObj<RolesService>;
  let modalService: jasmine.SpyObj<NgbModal>;
  let themeService: jasmine.SpyObj<ThemeService>;

  beforeEach(async () => {
    usuarioService = jasmine.createSpyObj('UsuariosService', ['ListarTodos', 'PostUsuario', 'PutUsuario']);
    rolService = jasmine.createSpyObj('RolesService', ['ListarTodos']);
    modalService = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);
    themeService = jasmine.createSpyObj('ThemeService', ['toggleTheme'], { isDarkMode$: of(false) });
  
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ReactiveFormsModule, UsuariosComponent],
      providers: [
        FormBuilder,
        { provide: UsuariosService, useValue: usuarioService },
        { provide: RolesService, useValue: rolService },
        { provide: NgbModal, useValue: modalService },
        { provide: ThemeService, useValue: themeService }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(UsuariosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
  

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users and roles on init', async () => {
    const mockUsers: Usuarios[] = [
      {
        idusuario: 1,
        username: 'user1',
        password_hash: 'hash123',
        idrol: 1,
        fechareg: new Date(),
        estado: 'Activo',
        IdPersonanav: {
          idpersona: 1,
          nombres: 'Juan',
          apellidos: 'Pérez',
          ci: '12345678',
          fechareg: new Date(),
          estado: 'Activo'
        },
        IdRolnav: {
          idrol: 1,
          nombre: 'Admin',
          estado: 'Activo'
        }
      }
    ];

    const mockRoles: Roles[] = [{ idrol: 1, nombre: 'Admin', estado: 'Activo' }];

    usuarioService.ListarTodos.and.returnValue(of(mockUsers));
    rolService.ListarTodos.and.returnValue(of(mockRoles));

    await component.ngOnInit();

    expect(component.listaUsuarios).toEqual(mockUsers);
    expect(component.roles).toEqual(mockRoles);
  });

  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
  });

  it('should insert a new user', async () => {
    const mockUser: Usuarios = {
      idusuario: 1,
      username: 'user1',
      password_hash: 'hash123',
      idrol: 1,
      fechareg: new Date(),
      estado: 'Activo',
      IdPersonanav: {
        idpersona: 1,
        nombres: 'Juan',
        apellidos: 'Pérez',
        ci: '12345678',
        fechareg: new Date(),
        estado: 'Activo'
      },
      IdRolnav: {
        idrol: 1,
        nombre: 'Admin',
        estado: 'Activo'
      }
    };

    usuarioService.PostUsuario.and.returnValue(of(mockUser));

    component.form.patchValue({
      idrol: 1,
      username: 'user1',
      password: 'Password1',
      nombres: 'John',
      apellidos: 'Doe',
      ci: '123456'
    });

    await component.Guardar();

    expect(usuarioService.PostUsuario).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success', title: 'Usuario Registrado!' }));
  });

  it('should update an existing user', async () => {
    const mockUser: Usuarios = {
      idusuario: 1,
      username: 'user1',
      password_hash: 'hash123',
      idrol: 1,
      fechareg: new Date(),
      estado: 'Activo'
    };

    usuarioService.PutUsuario.and.returnValue(of(mockUser));

    component.id = 1;
    component.form.patchValue({
      idrol: 1,
      username: 'user1',
      password: 'Password1',
      nombres: 'John',
      apellidos: 'Doe',
      ci: '123456'
    });

    await component.Guardar();

    expect(usuarioService.PutUsuario).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'success', title: 'Usuario Modificado!' }));
  });

  it('should select a user', async () => {
    const mockUser: Usuarios = {
      idusuario: 1,
      username: 'user1',
      password_hash: 'hash123',
      idrol: 1,
      fechareg: new Date(),
      estado: 'Activo',
      IdPersonanav: {
        idpersona: 1,
        nombres: 'John',
        apellidos: 'Doe',
        ci: '123456',
        fechareg: new Date(),
        estado: 'Activo'
      }
    };

    modalService.open.and.returnValue({ result: Promise.resolve() } as any);

    await component.SeleccionarUsuario('content', mockUser);

    expect(component.form.value.username).toBe('user1');
    expect(component.form.value.nombres).toBe('JOHN');
  });

  it('should change user state', async () => {
    const mockUser: Usuarios = {
      idusuario: 1,
      username: 'user1',
      password_hash: 'hash123',
      idrol: 1,
      fechareg: new Date(),
      estado: 'Activo'
    };

    usuarioService.PutUsuario.and.returnValue(of(mockUser));

    await component.CambiarEstado(mockUser, 'Inactivo');

    expect(usuarioService.PutUsuario).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error', title: 'Usuario Desactivado!' }));
  });

  it('should clear search', () => {
    component.search = 'test';
    component.LimpiarSearch();
    expect(component.search).toBe('');
  });

  it('should unsubscribe on destroy', () => {
    spyOn(component.themeSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.themeSubscription.unsubscribe).toHaveBeenCalled();
  });
});
