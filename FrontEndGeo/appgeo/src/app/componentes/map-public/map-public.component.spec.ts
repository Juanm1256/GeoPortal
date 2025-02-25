import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MapPublicComponent } from './map-public.component';

describe('MapPublicComponent', () => {
  let component: MapPublicComponent;
  let fixture: ComponentFixture<MapPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule, // Provee HttpClient para los servicios inyectados
        MapPublicComponent
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MapPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
