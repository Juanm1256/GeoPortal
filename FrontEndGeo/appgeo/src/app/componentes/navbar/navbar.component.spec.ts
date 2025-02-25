import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { ThemeService } from '../../servicios/theme.service';
import { AuthService } from '../../servicios/auth.service';
import { Subject } from 'rxjs';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  
  // Creamos mocks para los servicios que utiliza el componente
  let mockThemeService: Partial<ThemeService>;
  let mockAuthService: Partial<AuthService>;
  
  beforeEach(async () => {
    // Configuramos el mock del ThemeService
    const isDarkMode$ = new Subject<boolean>();
    mockThemeService = {
      isDarkMode$: isDarkMode$,
      toggleTheme: jasmine.createSpy('toggleTheme')
    };

    // Configuramos el mock del AuthService
    mockAuthService = {
      getToken: jasmine.createSpy('getToken').and.returnValue(null),
      getUserRole: jasmine.createSpy('getUserRole').and.returnValue(null),
      logout: jasmine.createSpy('logout')
    };

    await TestBed.configureTestingModule({
      imports: [NavbarComponent],
      providers: [
        { provide: ThemeService, useValue: mockThemeService },
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should invoke obtenerDatosDesdeToken and warn when token is absent', () => {
    // Espiamos console.warn para verificar que se muestre el mensaje
    spyOn(console, 'warn');
    component.obtenerDatosDesdeToken();
    expect(mockAuthService.getToken).toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledWith('⚠️ No hay token disponible.');
  });

  it('should subscribe to ThemeService and update isDarkMode', () => {
    // Simulamos que el servicio emite true y luego false
    (mockThemeService.isDarkMode$ as Subject<boolean>).next(true);
    fixture.detectChanges();
    expect(component.isDarkMode).toBe(true);

    (mockThemeService.isDarkMode$ as Subject<boolean>).next(false);
    fixture.detectChanges();
    expect(component.isDarkMode).toBe(false);
  });

  it('toggleTheme should call themeService.toggleTheme', () => {
    const event = new Event('click');
    spyOn(event, 'preventDefault');
    component.toggleTheme(event);
    expect(event.preventDefault).toHaveBeenCalled();
    expect(mockThemeService.toggleTheme).toHaveBeenCalled();
  });

  it('toggleSidebar should emit sidebarToggle event', () => {
    spyOn(component.sidebarToggle, 'emit');
    component.toggleSidebar();
    expect(component.sidebarToggle.emit).toHaveBeenCalled();
  });

  it('logout should call authService.logout', () => {
    component.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
  });
});
