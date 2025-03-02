import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MapPrivateComponent } from './map-private.component';
import { ThemeService } from '../../servicios/theme.service';
import { of, BehaviorSubject, Subscription } from 'rxjs';
import * as L from 'leaflet';
import Swal from 'sweetalert2';
describe('MapPrivateComponent', () => {
  let component: MapPrivateComponent;
  let fixture: ComponentFixture<MapPrivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Provee HttpClient para los servicios inyectados
        MapPrivateComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
