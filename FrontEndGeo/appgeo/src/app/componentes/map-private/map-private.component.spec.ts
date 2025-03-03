import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { MapPrivateComponent } from './map-private.component';
import { ThemeService } from '../../servicios/theme.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { of, Subscription } from 'rxjs';
import * as L from 'leaflet';

describe('MapPrivateComponent', () => {
  let componente: MapPrivateComponent;
  let fixture: ComponentFixture<MapPrivateComponent>;
  let servicioTemaSimulado: jasmine.SpyObj<ThemeService>;

  beforeEach(waitForAsync(() => {
    servicioTemaSimulado = jasmine.createSpyObj('ThemeService', ['isDarkMode$']);

    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, HttpClientTestingModule],
      providers: [{ provide: ThemeService, useValue: servicioTemaSimulado }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPrivateComponent);
    componente = fixture.componentInstance;
    servicioTemaSimulado.isDarkMode$ = of(false);
    componente.themeSubscription = new Subscription();
    fixture.detectChanges();

    if ((componente as any).map) {
      (componente as any).map.remove();
      (componente as any).map = null;
    }
  });

  afterEach(() => {
    if ((componente as any).map) {
      (componente as any).map.remove();
      (componente as any).map = null;
    }
    if (componente.themeSubscription) {
      componente.themeSubscription.unsubscribe();
    }
  });

  it('debería crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  it('debería inicializar el mapa en ngOnInit', fakeAsync(() => {
    componente.ngOnInit();
    tick(1000);
    expect((componente as any).map).toBeDefined();
  }));

  it('debería cancelar la suscripción al destruir el componente', () => {
    spyOn(componente.themeSubscription, 'unsubscribe').and.callThrough();
    componente.ngOnDestroy();
    expect(componente.themeSubscription.unsubscribe).toHaveBeenCalled();
  });
});
