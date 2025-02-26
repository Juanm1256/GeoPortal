import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { ThemeService } from '../../servicios/theme.service';
import { AuthService } from '../../servicios/auth.service';
import { Subject } from 'rxjs';

describe('ComponenteNavbar', () => {
  let componente: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  
  // Creamos mocks para los servicios que utiliza el componente
  let mockServicioTema: Partial<ThemeService>;
  let mockServicioAutenticacion: Partial<AuthService>;
  
  beforeEach(async () => {
    // Configuramos el mock del ThemeService
    const isDarkMode$ = new Subject<boolean>();
    mockServicioTema = {
      isDarkMode$: isDarkMode$,
      toggleTheme: jasmine.createSpy('toggleTheme')
    };

    // Configuramos el mock del AuthService
    mockServicioAutenticacion = {
      getToken: jasmine.createSpy('getToken').and.returnValue(null),
      getUserRole: jasmine.createSpy('getUserRole').and.returnValue(null),
      logout: jasmine.createSpy('logout')
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: ThemeService, useValue: mockServicioTema },
        { provide: AuthService, useValue: mockServicioAutenticacion }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    componente = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('Debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('Debe invocar obtenerDatosDesdeToken y mostrar advertencia cuando el token esté ausente', () => {
    // Espiamos console.warn para verificar que se muestre el mensaje
    spyOn(console, 'warn');
    componente.obtenerDatosDesdeToken();
    expect(mockServicioAutenticacion.getToken).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('⚠️ No hay token disponible.');
  });

  it('Debe suscribirse a ThemeService y actualizar isDarkMode', () => {
    // Simulamos que el servicio emite true y luego false
    (mockServicioTema.isDarkMode$ as Subject<boolean>).next(true);
    fixture.detectChanges();
    expect(componente.isDarkMode).toBe(true);

    (mockServicioTema.isDarkMode$ as Subject<boolean>).next(false);
    fixture.detectChanges();
    expect(componente.isDarkMode).toBe(false);
  });

  it('toggleTheme debe llamar a themeService.toggleTheme', () => {
    const evento = new Event('click');
    spyOn(evento, 'preventDefault');
    componente.toggleTheme(evento);
    expect(evento.preventDefault).toHaveBeenCalled();
    expect(mockServicioTema.toggleTheme).toHaveBeenCalled();
  });

  it('toggleSidebar debe emitir el evento sidebarToggle', () => {
    spyOn(componente.sidebarToggle, 'emit');
    componente.toggleSidebar();
    expect(componente.sidebarToggle.emit).toHaveBeenCalled();
  });

  it('logout debe llamar a authService.logout', () => {
    componente.logout();
    expect(mockServicioAutenticacion.logout).toHaveBeenCalled();
  });
});
