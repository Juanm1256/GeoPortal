import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LayoutComponent } from './layout.component';
import { AuthService } from '../../servicios/auth.service';
import { ThemeService } from '../../servicios/theme.service';
import { Subject } from 'rxjs';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

  // Stub para AuthService
  const authServiceStub = {
    getToken: jasmine.createSpy('getToken').and.returnValue(null),
    getUserRole: jasmine.createSpy('getUserRole').and.returnValue('admin'),
    logout: jasmine.createSpy('logout')
  };

  // Stub para ThemeService (usando un Subject para simular el observable)
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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to ThemeService and update isDarkMode', () => {
    // Emitir valores para simular cambios en el tema
    isDarkModeSubject.next(true);
    fixture.detectChanges();
    expect(component.isDarkMode).toBeTrue();

    isDarkModeSubject.next(false);
    fixture.detectChanges();
    expect(component.isDarkMode).toBeFalse();
  });

  it('toggleSidebar should toggle isSidebarCollapsed', () => {
    expect(component.isSidebarCollapsed).toBeFalse();
    component.toggleSidebar();
    expect(component.isSidebarCollapsed).toBeTrue();
    component.toggleSidebar();
    expect(component.isSidebarCollapsed).toBeFalse();
  });

  it('should obtain userRole from AuthService on init', () => {
    expect(authServiceStub.getUserRole).toHaveBeenCalled();
    expect(component.userRole).toEqual('admin');
  });

  it('should unsubscribe from themeSubscription on ngOnDestroy', () => {
    spyOn(component.themeSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(component.themeSubscription.unsubscribe).toHaveBeenCalled();
  });
});
