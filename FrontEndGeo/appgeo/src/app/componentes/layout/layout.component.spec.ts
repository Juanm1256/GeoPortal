import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LayoutComponent } from './layout.component';
import { AuthService } from '../../servicios/auth.service';
import { ThemeService } from '../../servicios/theme.service';
import { Subject } from 'rxjs';

describe('ComponenteLayout', () => {
  let componente: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  const authServiceStub = {
    getToken: jasmine.createSpy('getToken').and.returnValue(null),
    getUserRole: jasmine.createSpy('getUserRole').and.returnValue('admin'),
    logout: jasmine.createSpy('logout')
  };
  const isDarkModeSubject = new Subject<boolean>();
  const themeServiceStub = {
    isDarkMode$: isDarkModeSubject,
    toggleTheme: jasmine.createSpy('toggleTheme')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        LayoutComponent
      ],
      providers: [
        { provide: AuthService, useValue: authServiceStub },
        { provide: ThemeService, useValue: themeServiceStub }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
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

  it('toggleSidebar debe alternar isSidebarCollapsed', () => {
    expect(componente.isSidebarCollapsed).toBeFalse();
    componente.toggleSidebar();
    expect(componente.isSidebarCollapsed).toBeTrue();
    componente.toggleSidebar();
    expect(componente.isSidebarCollapsed).toBeFalse();
  });

  it('Debe obtener el rol del usuario desde AuthService en la inicialización', () => {
    expect(authServiceStub.getUserRole).toHaveBeenCalled();
    expect(componente.userRole).toEqual('admin');
  });

  it('Debe cancelar la suscripción a themeSubscription en ngOnDestroy', () => {
    spyOn(componente.themeSubscription, 'unsubscribe');
    componente.ngOnDestroy();
    expect(componente.themeSubscription.unsubscribe).toHaveBeenCalled();
  });
});
