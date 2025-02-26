import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('ComponenteApp', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
    }).compileComponents();
  });

  it('Debe crear la aplicación', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`Debe tener el título 'appgeo'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('appgeo');
  });
});
