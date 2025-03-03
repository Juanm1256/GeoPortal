import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { of, Subject } from 'rxjs';
import { ThemeService } from '../../servicios/theme.service';
import { UsuariosService } from '../../servicios/usuarios.service';
import { RolesService } from '../../servicios/roles.service';
import { CapitalesDepartamentalesService } from '../../servicios/maps/capitales-departamentales.service';
import { CuencasService } from '../../servicios/maps/cuencas.service';
import { LimitesDepartamentalesService } from '../../servicios/maps/limites-departamentales.service';
import { LimitesMunicipalesService } from '../../servicios/maps/limites-municipales.service';
import { MercadosService } from '../../servicios/maps/mercados.service';
import { ProveedoralevinesService } from '../../servicios/maps/proveedoralevines.service';
import { ProveedoralimentosService } from '../../servicios/maps/proveedoralimentos.service';
import { ProveedorasistenciatecnicaService } from '../../servicios/maps/proveedorasistenciatecnica.service';
import { ElementRef } from '@angular/core';

const usuariosData = [{ nombre: 'Usuario1' }, { nombre: 'Usuario2' }];
const rolesData = [{}, {}];
const capitalesDepData = [{}, {}];
const cuencasData = [{}];
const limitesDepData = [{}];
const limitesMunData = [{}];
const mercadosData = [{}];
const proveedoresAlevinesData = [{}];
const proveedoresAlimentosData = [{}];
const proveedoresAsistenciaData = [{}];

describe('ComponenteDashboard', () => {
  let componente: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  const isDarkModeSubject = new Subject<boolean>();
  const themeServiceStub = {
    isDarkMode$: isDarkModeSubject,
    toggleTheme: jasmine.createSpy('toggleTheme')
  };

  const usuariosServiceStub = {
    ListarTodos: jasmine.createSpy('ListarTodos').and.returnValue(of(usuariosData))
  };
  const rolesServiceStub = {
    ListarTodos: jasmine.createSpy('ListarTodos').and.returnValue(of(rolesData))
  };
  const capDepServiceStub = {
    listarTodos: jasmine.createSpy('listarTodos').and.returnValue(of(capitalesDepData))
  };
  const cuencasServiceStub = {
    listarTodos: jasmine.createSpy('listarTodos').and.returnValue(of(cuencasData))
  };
  const limitesDepServiceStub = {
    listarTodos: jasmine.createSpy('listarTodos').and.returnValue(of(limitesDepData))
  };
  const limitesMunServiceStub = {
    listarTodos: jasmine.createSpy('listarTodos').and.returnValue(of(limitesMunData))
  };
  const mercadosServiceStub = {
    listarTodos: jasmine.createSpy('listarTodos').and.returnValue(of(mercadosData))
  };
  const proveedorAlevinesServiceStub = {
    listarTodos: jasmine.createSpy('listarTodos').and.returnValue(of(proveedoresAlevinesData))
  };
  const proveedorAlimentosServiceStub = {
    listarTodos: jasmine.createSpy('listarTodos').and.returnValue(of(proveedoresAlimentosData))
  };
  const proveedorAsistenciaServiceStub = {
    listarTodos: jasmine.createSpy('listarTodos').and.returnValue(of(proveedoresAsistenciaData))
  };

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        DashboardComponent
      ],
      providers: [
        { provide: ThemeService, useValue: themeServiceStub },
        { provide: UsuariosService, useValue: usuariosServiceStub },
        { provide: RolesService, useValue: rolesServiceStub },
        { provide: CapitalesDepartamentalesService, useValue: capDepServiceStub },
        { provide: CuencasService, useValue: cuencasServiceStub },
        { provide: LimitesDepartamentalesService, useValue: limitesDepServiceStub },
        { provide: LimitesMunicipalesService, useValue: limitesMunServiceStub },
        { provide: MercadosService, useValue: mercadosServiceStub },
        { provide: ProveedoralevinesService, useValue: proveedorAlevinesServiceStub },
        { provide: ProveedoralimentosService, useValue: proveedorAlimentosServiceStub },
        { provide: ProveedorasistenciatecnicaService, useValue: proveedorAsistenciaServiceStub }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('Debe suscribirse a ThemeService y actualizar isDarkMode', () => {
    isDarkModeSubject.next(true);
    fixture.detectChanges();
    expect(componente.isDarkMode).toBeTrue();

    isDarkModeSubject.next(false);
    fixture.detectChanges();
    expect(componente.isDarkMode).toBeFalse();
  });

  it('Debe cargar los datos y actualizar los totales correctamente', async () => {
    await componente.cargarDatos();
    fixture.detectChanges();
  
    expect(componente.totalUsuarios).toEqual(usuariosData.length);
    expect(componente.totalRoles).toEqual(rolesData.length);
    expect(componente.totalCapas).toEqual(8);
  
    expect(componente.cantidadPorCapa).toEqual([
      { nombre: 'Capitales Departamentales', cantidad: capitalesDepData.length },
      { nombre: 'Cuencas', cantidad: cuencasData.length },
      { nombre: 'Límites Departamentales', cantidad: limitesDepData.length },
      { nombre: 'Límites Municipales', cantidad: limitesMunData.length },
      { nombre: 'Mercados', cantidad: mercadosData.length },
      { nombre: 'Proveedores de Alevines', cantidad: proveedoresAlevinesData.length },
      { nombre: 'Proveedores de Alimentos', cantidad: proveedoresAlimentosData.length },
      { nombre: 'Proveedores de Asistencia Técnica', cantidad: proveedoresAsistenciaData.length }
    ]);
  });

  it('Debe crear una instancia del gráfico después de llamar a actualizarGrafico', async () => {
    const canvasEl = document.createElement('canvas');
    componente.chartCanvas = { nativeElement: canvasEl } as ElementRef<HTMLCanvasElement>;

    await (componente as any).actualizarGrafico();
    expect((componente as any).chartInstance).toBeTruthy();
  });
});
