import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });
  it('Debe crearse correctamente', () => {
    expect(service).toBeTruthy();
  });

  it('Debe iniciar con el tema claro por defecto si no hay un tema guardado', () => {
    const themeService = new ThemeService();
    let isDarkMode: boolean | undefined;

    themeService.isDarkMode$.subscribe(value => {
      isDarkMode = value;
    });

    expect(isDarkMode).toBeFalse();
  });

  it('Debe cargar el tema oscuro si estaba guardado en sessionStorage', () => {
    sessionStorage.setItem('theme', 'dark');
    const themeService = new ThemeService();
    let isDarkMode: boolean | undefined;

    themeService.isDarkMode$.subscribe(value => {
      isDarkMode = value;
    });

    expect(isDarkMode).toBeTrue();
  });

  it('Debe alternar el tema correctamente', fakeAsync(() => {
  let isDarkMode!: boolean;
  service.isDarkMode$.subscribe(value => {
    isDarkMode = value;
  });

  service.toggleTheme();
  tick(); 
  expect(isDarkMode).toBeTrue(); 
  expect(sessionStorage.getItem('theme')).toBe('dark'); 
  service.toggleTheme();
  tick();
  expect(isDarkMode).toBeFalse(); 
  expect(sessionStorage.getItem('theme')).toBe('light');
}));


  it('Debe reflejar los cambios en el observable cuando se alterna el tema', fakeAsync(() => {
    let isDarkMode: boolean | undefined;
    service.isDarkMode$.subscribe(value => {
      isDarkMode = value;
    });

    service.toggleTheme();
    tick(); 

    expect(isDarkMode).toBeTrue();
  }));
});
