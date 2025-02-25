import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SidebarComponent } from './sidebar.component';
import { ThemeService } from '../../servicios/theme.service';
import { Subject } from 'rxjs';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let themeServiceStub: Partial<ThemeService>;
  let isDarkModeSubject: Subject<boolean>;

  beforeEach(async () => {
    // Mock de ThemeService
    isDarkModeSubject = new Subject<boolean>();
    themeServiceStub = {
      isDarkMode$: isDarkModeSubject.asObservable(),
      toggleTheme: jasmine.createSpy('toggleTheme')
    };

    await TestBed.configureTestingModule({
      imports: [SidebarComponent],
      providers: [{ provide: ThemeService, useValue: themeServiceStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to ThemeService and update isDarkMode', () => {
    isDarkModeSubject.next(true);
    expect(component.isDarkMode).toBeTrue();

    isDarkModeSubject.next(false);
    expect(component.isDarkMode).toBeFalse();
  });

  it('should call toggleTheme when toggleTheme is called', () => {
    component.toggleTheme();
    expect(themeServiceStub.toggleTheme).toHaveBeenCalled();
  });

  it('should toggle isSidebarCollapsed and isSidebarGeo', () => {
    component.isSidebarCollapsed = false;
    component.isSidebarGeo = false;

    component.toggleSidebar();
    expect(component.isSidebarCollapsed).toBeTrue();
    expect(component.isSidebarGeo).toBeTrue();

    component.toggleSidebar();
    expect(component.isSidebarCollapsed).toBeFalse();
    expect(component.isSidebarGeo).toBeFalse();
  });

  it('should unsubscribe from ThemeService on destroy', () => {
    const unsubscribeSpy = spyOn(component['themeSubscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
