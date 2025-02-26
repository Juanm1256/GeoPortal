import { TestBed } from '@angular/core/testing';
import { ThemeService } from './theme.service';
import { fakeAsync, tick } from '@angular/core/testing';

describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    sessionStorage.clear(); // ✅ Limpia el almacenamiento antes de cada prueba
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

    expect(isDarkMode).toBeFalse(); // Por defecto debe ser false (modo claro)
  });

  it('Debe cargar el tema oscuro si estaba guardado en sessionStorage', () => {
    sessionStorage.setItem('theme', 'dark');
    const themeService = new ThemeService();
    let isDarkMode: boolean | undefined;

    themeService.isDarkMode$.subscribe(value => {
      isDarkMode = value;
    });

    expect(isDarkMode).toBeTrue(); // Debe ser true si 'dark' estaba guardado
  });

  it('Debe alternar el tema correctamente', fakeAsync(() => {
  let isDarkMode!: boolean;

  // Suscribirse al observable para recibir los cambios
  service.isDarkMode$.subscribe(value => {
    isDarkMode = value;
  });

  // Cambiar a modo oscuro
  service.toggleTheme();
  tick(); // Simular el tiempo necesario para que RxJS propague el cambio
  expect(isDarkMode).toBeTrue(); // Ahora debe estar en modo oscuro
  expect(sessionStorage.getItem('theme')).toBe('dark'); // El almacenamiento debe actualizarse

  // Cambiar a modo claro
  service.toggleTheme();
  tick();
  expect(isDarkMode).toBeFalse(); // Ahora debe estar en modo claro
  expect(sessionStorage.getItem('theme')).toBe('light'); // El almacenamiento debe actualizarse nuevamente
}));


  it('Debe reflejar los cambios en el observable cuando se alterna el tema', fakeAsync(() => {
    let isDarkMode: boolean | undefined;
    service.isDarkMode$.subscribe(value => {
      isDarkMode = value;
    });

    service.toggleTheme();
    tick(); // Simula el paso del tiempo para que RxJS propague el cambio

    expect(isDarkMode).toBeTrue(); // Ahora sí debería reflejar el cambio
  }));
});
