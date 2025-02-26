import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { ThemeService } from '../../servicios/theme.service';
import { Subject } from 'rxjs';

describe('ComponenteSidebar', () => {
  let componente: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let temaServicioStub: Partial<ThemeService>;
  let isDarkModeSubject: Subject<boolean>;

  beforeEach(async () => {
    // Simulación del servicio ThemeService
    isDarkModeSubject = new Subject<boolean>();
    temaServicioStub = {
      isDarkMode$: isDarkModeSubject.asObservable(),
      toggleTheme: jasmine.createSpy('toggleTheme')
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [{ provide: ThemeService, useValue: temaServicioStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('Debe suscribirse a ThemeService y actualizar isDarkMode', () => {
    isDarkModeSubject.next(true);
    expect(componente.isDarkMode).toBeTrue();

    isDarkModeSubject.next(false);
    expect(componente.isDarkMode).toBeFalse();
  });

  it('Debe llamar a toggleTheme cuando se ejecuta toggleTheme', () => {
    componente.toggleTheme();
    expect(temaServicioStub.toggleTheme).toHaveBeenCalled();
  });

  it('Debe alternar isSidebarCollapsed e isSidebarGeo', () => {
    componente.isSidebarCollapsed = false;
    componente.isSidebarGeo = false;

    componente.toggleSidebar();
    expect(componente.isSidebarCollapsed).toBeTrue();
    expect(componente.isSidebarGeo).toBeTrue();

    componente.toggleSidebar();
    expect(componente.isSidebarCollapsed).toBeFalse();
    expect(componente.isSidebarGeo).toBeFalse();
  });

  it('Debe cancelar la suscripción a ThemeService al destruirse', () => {
    const unsubscribeSpy = spyOn(componente['themeSubscription'], 'unsubscribe');
    componente.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
