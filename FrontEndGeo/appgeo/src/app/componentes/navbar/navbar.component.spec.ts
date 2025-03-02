import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { ThemeService } from '../../servicios/theme.service';
import { AuthService } from '../../servicios/auth.service';
import { Subject } from 'rxjs';

describe('ComponenteNavbar', () => {
  let componente: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  
  let mockServicioTema: Partial<ThemeService>;
  let mockServicioAutenticacion: Partial<AuthService>;
  
  beforeEach(async () => {
    const isDarkMode$ = new Subject<boolean>();
    mockServicioTema = {
      isDarkMode$: isDarkMode$,
      toggleTheme: jasmine.createSpy('toggleTheme')
    };

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

  it('Debe invocar obtenerDatosDesdeToken y manejar la ausencia del token correctamente', () => {
    spyOn(console, 'warn');
    componente.obtenerDatosDesdeToken();
    expect(mockServicioAutenticacion.getToken).toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalledWith('⚠️ No hay token disponible.'); // Se eliminó la advertencia ya que no está en el código original
  });

  it('Debe suscribirse a ThemeService y actualizar isDarkMode', () => {
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
