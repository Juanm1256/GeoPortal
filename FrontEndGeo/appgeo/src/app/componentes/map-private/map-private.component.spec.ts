import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MapPrivateComponent } from './map-private.component';
import { ThemeService } from '../../servicios/theme.service';
import { of, Subscription, BehaviorSubject } from 'rxjs';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
import { fakeAsync, tick } from '@angular/core/testing';
/*
// Mock de dom-to-image para Jasmine
const mockDomToImage = {
  toPng: jasmine.createSpy('toPng').and.returnValue(Promise.resolve('data:image/png;base64,MOCK_IMAGE_DATA'))
};

// Sobrescribir el módulo global
(globalThis as any).domtoimage = mockDomToImage;

// ✅ COMIENZO DE LAS PRUEBAS UNITARIAS
describe('MapPrivateComponent', () => {
  let component: MapPrivateComponent;
  let fixture: ComponentFixture<MapPrivateComponent>;
  let themeService: jasmine.SpyObj<ThemeService>;
  let isDarkModeSubject: BehaviorSubject<boolean>;

  beforeEach(async () => {
    isDarkModeSubject = new BehaviorSubject<boolean>(false);

    themeService = jasmine.createSpyObj('ThemeService', ['toggleTheme'], {
      isDarkMode$: isDarkModeSubject.asObservable() // ✅ Mock con BehaviorSubject
    });

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MapPrivateComponent],
      providers: [{ provide: ThemeService, useValue: themeService }]
    }).compileComponents();

    fixture = TestBed.createComponent(MapPrivateComponent);
    component = fixture.componentInstance;
    component['map'] = L.map(document.createElement('div')); // Simula el mapa para las pruebas
    component.themeSubscription = new Subscription(); // ✅ Inicializa la suscripción
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component.themeSubscription) {
      component.themeSubscription.unsubscribe();
    }
    if (component['map']) {
      component['map'].off(); // Limpia eventos
      component['map'].remove(); // Elimina la instancia de Leaflet
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle base map', () => {
    const addLayerSpy = spyOn(component['map'], 'addLayer');
    const removeLayerSpy = spyOn(component['map'], 'removeLayer');
  
    component['activeBaseLayer'] = L.tileLayer(''); // Simula la capa base activa
    component.toggleBaseMap();
  
    expect(removeLayerSpy).toHaveBeenCalled();
    expect(addLayerSpy).toHaveBeenCalled();
  });

  it('should subscribe to theme changes', (done) => {
    isDarkModeSubject.next(true); // Simula el cambio a modo oscuro
    fixture.detectChanges(); // Detecta los cambios
  
    setTimeout(() => {
      expect(component.isDarkMode).toBeTrue();
      done(); // Indica que la prueba ha finalizado correctamente
    }, 100);
  });
  

  it('should unsubscribe on destroy', () => {
    const spy = spyOn(component.themeSubscription, 'unsubscribe');
    component.ngOnDestroy();
    expect(spy).toHaveBeenCalled();
  
    if (component['map']) {
      component['map'].off(); // Limpia eventos
      component['map'].remove(); // Elimina la instancia de mapa
    }
  });

  it('should add and remove custom marker', () => {
    const markerLayerSpy = spyOn(component['markerLayer'], 'addLayer');
    const mapRemoveLayerSpy = spyOn(component['map'], 'removeLayer');

    component['markers'] = []; // Inicializa la lista de marcadores
    component.addCustomMarker();

    expect(markerLayerSpy).toHaveBeenCalled();
    expect(component['markers'].length).toBe(1);

    const marker = component['markers'][0];
    component.removeMarker(marker);

    expect(mapRemoveLayerSpy).toHaveBeenCalled();
    expect(component['markers'].length).toBe(0);
  });

  it('should capture map image', async () => {
    const linkSpy = spyOn(document, 'createElement').and.callThrough();
    await component.captureMap();
    expect(linkSpy).toHaveBeenCalledWith('a');
  });
  

  it('should toggle layer visibility', (done) => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000; // Aumenta el límite de tiempo
    
    const layerName = 'cuencas';
    const event = { target: { closest: () => ({ classList: { add: () => {}, remove: () => {} } }) } };
    const addLayerSpy = spyOn(component['map'], 'addLayer');
    const removeLayerSpy = spyOn(component['map'], 'removeLayer');
  
    component.toggleLayer(layerName, event).then(() => {
      expect(addLayerSpy).toHaveBeenCalled();
  
      component.toggleLayer(layerName, event).then(() => {
        expect(removeLayerSpy).toHaveBeenCalled();
        done(); // Finaliza la prueba correctamente
      });
    });
  });

  it('should reset map view', async () => {
    const mapSetViewSpy = spyOn(component['map'], 'setView');
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({ isConfirmed: true } as any));
  
    await component.resetMapView();
  
    expect(swalSpy).toHaveBeenCalled();
    expect(mapSetViewSpy).toHaveBeenCalledWith([-16.54529, -64.7400], 6);
  });
  
});
*/