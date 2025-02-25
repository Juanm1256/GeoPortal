import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RolesComponent } from './roles.component';
import { FormBuilder, FormControl, ReactiveFormsModule, FormArray } from '@angular/forms';
import { RolesPermisoService } from '../../servicios/roles-permiso.service';
import { RolesService } from '../../servicios/roles.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import Swal from 'sweetalert2';

describe('RolesComponent', () => {
  let component: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;
  let rolesService: jasmine.SpyObj<RolesService>;
  let rolesPermisoService: jasmine.SpyObj<RolesPermisoService>;
  let modalService: jasmine.SpyObj<NgbModal>;

  beforeEach(async () => {
    rolesService = jasmine.createSpyObj('RolesService', ['ListarTodos', 'ListarPermiso']);
    rolesPermisoService = jasmine.createSpyObj('RolesPermisoService', ['insertar', 'modificar']);
    modalService = jasmine.createSpyObj('NgbModal', ['open', 'dismissAll']);
  
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RolesComponent],
      providers: [
        { provide: RolesService, useValue: rolesService },
        { provide: RolesPermisoService, useValue: rolesPermisoService },
        { provide: NgbModal, useValue: modalService }
      ]
    }).compileComponents();
  
    fixture = TestBed.createComponent(RolesComponent);
    component = fixture.componentInstance;
  
    // ✅ Simula la suscripción al tema
    component.themeSubscription = jasmine.createSpyObj('Subscription', ['unsubscribe']);
  
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load roles on init', async () => {
    const mockRoles = [{ idrol: 1, nombre: 'Admin', estado: 'Activo', permisos: ['Crear', 'Editar'] }];
    rolesService.ListarTodos.and.returnValue(of(mockRoles));

    await component.cargarRoles();
    expect(component.listaRol).toEqual(mockRoles);
    expect(component.isLoading).toBeFalse();
  });

  // ✅ Test: should insert a new role
  it('should insert a new role', async () => {
    const mockPermisos = [1, 2];
    (component as any).fb = TestBed.inject(FormBuilder);
    component.form.addControl('permisos', (component as any).fb.array([])); // ✅ Añadimos el control manualmente

    // ✅ Añadimos los permisos antes de usar setValue
    mockPermisos.forEach(id => component.permisos.push(new FormControl(id)));

    component.form.patchValue({ nombre: 'NEW ROLE', permisos: mockPermisos }); // ✅ Usamos patchValue para evitar errores

    await component.Guardar();

    expect(rolesPermisoService.insertar).toHaveBeenCalledWith({
      nombreRol: 'NEW ROLE',
      estado: 'Activo',
      IdPermisos: mockPermisos
    });
  });

  // ✅ Test: should update an existing role
  it('should update an existing role', async () => {
    const mockPermisos = [1];
    (component as any).fb = TestBed.inject(FormBuilder);
    component.form.addControl('permisos', (component as any).fb.array([])); // ✅ Añadimos el control manualmente

    // ✅ Añadimos los permisos antes de usar setValue
    mockPermisos.forEach(id => component.permisos.push(new FormControl(id)));

    component.form.patchValue({ nombre: 'UPDATED ROLE', permisos: mockPermisos }); // ✅ Usamos patchValue
    component.id = '1';

    await component.Guardar();

    expect(rolesPermisoService.modificar).toHaveBeenCalledWith({
      nombreRol: 'UPDATED ROLE',
      estado: 'Activo',
      IdPermisos: mockPermisos
    }, '1');
  });

  it('should change role state', async () => {
    const mockRol = { idrol: 1, nombre: 'Test Role', estado: 'Activo', permisos: ['Crear'] };
    rolesPermisoService.modificar.and.returnValue(of(true));

    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
    await component.CambiarEstado(mockRol, 'Inactivo');

    expect(rolesPermisoService.modificar).toHaveBeenCalled();
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({ icon: 'error', title: 'El rol ha sido desactivado!' }));
  });

  it('should open modal for creating role', async () => {
    modalService.open.and.returnValue({ result: Promise.resolve() } as any);
    await component.Guardarinstruct('mockContent');
    expect(modalService.open).toHaveBeenCalledWith('mockContent');
  });

  it('should open modal and select role', async () => {
    const mockRol = { idrol: 1, nombre: 'Test Role', estado: 'Activo', permisos: ['1', '2'] };
    modalService.open.and.returnValue({ result: Promise.resolve() } as any);

    await component.SeleccionarRol('mockContent', mockRol);

    expect(modalService.open).toHaveBeenCalledWith('mockContent');
    expect(component.form.value.nombre).toBe('Test Role');
  });

  it('should clear search', () => {
    component.search = 'Test';
    component.LimpiarSearch();
    expect(component.search).toBe('');
  });

  it('should toggle theme', () => {
    const themeSpy = spyOn(component.themeService, 'toggleTheme');
    component.toggleTheme();
    expect(themeSpy).toHaveBeenCalled();
  });

  it('should unsubscribe on destroy', () => {
    component.ngOnDestroy();
    expect(component.themeSubscription.unsubscribe).toHaveBeenCalled();
  });
});
