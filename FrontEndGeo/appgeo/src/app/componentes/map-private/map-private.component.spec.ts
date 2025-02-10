import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPrivateComponent } from './map-private.component';

describe('MapPrivateComponent', () => {
  let component: MapPrivateComponent;
  let fixture: ComponentFixture<MapPrivateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPrivateComponent]
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
