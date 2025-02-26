import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RolesComponent } from './roles.component';
import { FormBuilder, FormControl, ReactiveFormsModule, FormArray } from '@angular/forms';
import { RolesPermisoService } from '../../servicios/roles-permiso.service';
import { RolesService } from '../../servicios/roles.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('ComponenteRoles', () => {
  let componente: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;
  let servicioRoles: jasmine.SpyObj<RolesService>;
  let servicioRolesPermiso: jasmine.SpyObj<RolesPermisoService>;
  let servicioModal: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    servicioRoles = jasmine.createSpyObj('RolesService', ['ListarTodos', 'ListarPermiso']);
    servicioRolesPermiso = jasmine.createSpyObj('RolesPermisoService', ['insertar', 'modificar']);
    servicioModal = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);
  
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RolesComponent],
      providers: [
        { provide: RolesService, useValue: servicioRoles },
        { provide: RolesPermisoService, useValue: servicioRolesPermiso },
        { provide: NgbModal, useValue: servicioModal }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(RolesComponent);
    componente = fixture.componentInstance;
  
    // ✅ Simula la suscripción al tema
    componente.themeSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('Debe cargar los roles al inicializar', async () => {
    const rolesMock = [{ idrol: 1, nombre: 'Admin', estado: 'Activo', permisos: ['Crear', 'Editar'] }];
    servicioRoles.ListarTodos.and.returnValue(of(rolesMock));

    await componente.cargarRoles();
    expect(componente.listaRol).toEqual(rolesMock);
    expect(componente.isLoading).toBeFalse();
  });

  // ✅ Prueba: Debe insertar un nuevo rol
  it('Debe insertar un nuevo rol', async () => {
    const permisosMock = [1, 2];
    (componente as any).fb = TestBed.inject(FormBuilder);
    componente.form.addControl('permisos', (componente as any).fb.array([])); // ✅ Se añade el control manualmente

    // ✅ Se añaden los permisos antes de usar setValue
    permisosMock.forEach(id => componente.permisos.push(new FormControl(id)));

    componente.form.patchValue({ nombre: 'NUEVO ROL', permisos: permisosMock }); // ✅ Se usa patchValue para evitar errores

    await componente.Guardar();

    expect(servicioRolesPermiso.insertar).toHaveBeenCalledWith({
      nombreRol: 'NUEVO ROL',
      estado: 'Activo',
      IdPermisos: permisosMock
    });
  });

  // ✅ Prueba: Debe actualizar un rol existente
  it('Debe actualizar un rol existente', async () => {
    const permisosMock = [1];
    (componente as any).fb = TestBed.inject(FormBuilder);
    componente.form.addControl('permisos', (componente as any).fb.array([])); // ✅ Se añade el control manualmente

    // ✅ Se añaden los permisos antes de usar setValue
    permisosMock.forEach(id => componente.permisos.push(new FormControl(id)));

    componente.form.patchValue({ nombre: 'ROL ACTUALIZADO', permisos: permisosMock }); // ✅ Se usa patchValue
    componente.id = '1';

    await componente.Guardar();

    expect(servicioRolesPermiso.modificar).toHaveBeenCalledWith({
      nombreRol: 'ROL ACTUALIZADO',
      estado: 'Activo',
      IdPermisos: permisosMock
    }, '1');
  });

  it('Debe cambiar el estado del rol', async () => {
    const rolMock = { idrol: 1, nombre: 'Rol de prueba', estado: 'Activo', permisos: ['Crear'] };
    servicioRolesPermiso.modificar.and.returnValue(of(true));

    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
    await componente.CambiarEstado(rolMock, 'Inactivo');

    expect(servicioRolesPermiso.modificar).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error', title: 'El rol ha sido desactivado!' }));
  });

  it('Debe abrir el modal para crear un rol', async () => {
    servicioModal.open.and.returnValue({ result: Promise.resolve() } as any);
    await componente.Guardarinstruct('mockContent');
    expect(servicioModal.open).toHaveBeenCalledWith('mockContent');
  });

  it('Debe abrir el modal y seleccionar un rol', async () => {
    const rolMock = { idrol: 1, nombre: 'Rol de prueba', estado: 'Activo', permisos: ['1', '2'] };
    servicioModal.open.and.returnValue({ result: Promise.resolve() } as any);

    await componente.SeleccionarRol('mockContent', rolMock);

    expect(servicioModal.open).toHaveBeenCalledWith('mockContent');
    expect(componente.form.value.nombre).toBe('Rol de prueba');
  });

  it('Debe limpiar la búsqueda', () => {
    componente.search = 'Prueba';
    componente.LimpiarSearch();
    expect(componente.search).toBe('');
  });

  it('Debe alternar el tema', () => {
    const themeSpy = spyOn(componente.themeService, 'toggleTheme');
    componente.toggleTheme();
    expect(themeSpy).toHaveBeenCalled();
  });

  it('Debe desuscribirse al destruir el componente', () => {
    componente.ngOnDestroy();
    expect(componente.themeSubscription.unsubscribe).toHaveBeenCalled();
  });
});
