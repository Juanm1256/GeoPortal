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

// Datos de prueba para cada servicio
const usuariosData = [{ nombre: 'User1' }, { nombre: 'User2' }];
const rolesData = [{}, {}];
const capitalesDepData = [{}, {}];       // 2 elementos
const cuencasData = [{}];                // 1 elemento
const limitesDepData = [{}];             // 1 elemento
const limitesMunData = [{}];             // 1 elemento
const mercadosData = [{}];               // 1 elemento
const proveedoresAlevinesData = [{}];    // 1 elemento
const proveedoresAlimentosData = [{}];   // 1 elemento
const proveedoresAsistenciaData = [{}];  // 1 elemento

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;

  // Stub para ThemeService: se utiliza un Subject para simular isDarkMode$
  const isDarkModeSubject = new Subject<boolean>();
  const themeServiceStub = {
    isDarkMode$: isDarkModeSubject,
    toggleTheme: jasmine.createSpy('toggleTheme')
  };

  // Stubs para los servicios que retornan observables con datos de prueba
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to ThemeService and update isDarkMode', () => {
    // Emite true y verifica la actualización
    isDarkModeSubject.next(true);
    fixture.detectChanges();
    expect(component.isDarkMode).toBeTrue();

    // Emite false y verifica la actualización
    isDarkModeSubject.next(false);
    fixture.detectChanges();
    expect(component.isDarkMode).toBeFalse();
  });
  it('should load data and update totals correctly', async () => {
    // Llamamos a cargarDatos y esperamos su finalización
    await component.cargarDatos();
    fixture.detectChanges();
  
    // Verificamos que se hayan actualizado las propiedades
    expect(component.totalUsuarios).toEqual(usuariosData.length);
    expect(component.totalRoles).toEqual(rolesData.length);
    // totalCapas es el número de arrays enviados en el forkJoin (8)
    expect(component.totalCapas).toEqual(8);
  
    // Verificamos la data procesada en cantidadPorCapa
    expect(component.cantidadPorCapa).toEqual([
      { nombre: 'Capitales Departamentales', cantidad: capitalesDepData.length },
      { nombre: 'Cuencas', cantidad: cuencasData.length },
      { nombre: 'Límites Departamentales', cantidad: limitesDepData.length },
      { nombre: 'Límites Municipales', cantidad: limitesMunData.length },
      { nombre: 'Mercados', cantidad: mercadosData.length },
      { nombre: 'Proveedores de Alevines', cantidad: proveedoresAlevinesData.length },
      { nombre: 'Proveedores de Alimentos', cantidad: proveedoresAlimentosData.length },
      { nombre: 'Proveedores de Asistencia Técnica', cantidad: proveedoresAsistenciaData.length }
    ]);
  
    // Verifica que el último usuario sea el correcto
    expect(component.ultimoUsuario).toEqual(usuariosData[usuariosData.length - 1]);
  });

  // Se podrían agregar pruebas para actualizarGrafico,
  // aunque probar Chart.js directamente suele requerir stubbing adicional o
  // verificar que se haya creado chartInstance, por ejemplo:
  it('should create a chart instance after actualizarGrafico is called', async () => {
    // Simular que el canvas existe:
    const canvasEl = document.createElement('canvas');
    component.chartCanvas = { nativeElement: canvasEl } as ElementRef<HTMLCanvasElement>;

    // Ejecutar la actualización del gráfico
    await (component as any).actualizarGrafico();
    expect((component as any).chartInstance).toBeTruthy();
  });
});
