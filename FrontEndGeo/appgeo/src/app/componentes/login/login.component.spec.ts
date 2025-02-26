import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../servicios/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { LoginResponse } from '../../interfaces/login-response';

describe('ComponenteLogin', () => {
  let componente: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let servicioAuth: jasmine.SpyObj<AuthService>;
  let servicioRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['login', 'saveToken', 'getUserRole']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, LoginComponent, ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    componente = fixture.componentInstance;
    servicioAuth = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    servicioRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  // ✅ 1. Creación del componente
  it('Debe crear el componente', () => {
    expect(componente).toBeTruthy();
  });

  // ✅ 2. Validaciones del formulario
  it('Debe inicializar el formulario con valores vacíos', () => {
    expect(componente.form.get('usuario')?.value).toBe('');
    expect(componente.form.get('contraseña')?.value).toBe('');
  });

  it('Debe invalidar el formulario cuando los campos están vacíos', () => {
    componente.form.get('usuario')?.setValue('');
    componente.form.get('contraseña')?.setValue('');
    expect(componente.form.invalid).toBeTrue();
  });

  it('Debe validar el campo usuario', () => {
    const usuario = componente.form.get('usuario');
    usuario?.setValue('usuario123');
    expect(usuario?.valid).toBeTrue();

    usuario?.setValue('');
    expect(usuario?.invalid).toBeTrue();
  });

  it('Debe validar el campo contraseña', () => {
    const contraseña = componente.form.get('contraseña');
    contraseña?.setValue('password123');
    expect(contraseña?.valid).toBeTrue();

    contraseña?.setValue('123');
    expect(contraseña?.invalid).toBeTrue();
  });

  // ✅ 3. Mostrar/Ocultar Contraseña
  it('Debe alternar la visibilidad de la contraseña', () => {
    expect(componente.showPassword).toBeFalse();
    componente.togglePasswordVisibility();
    expect(componente.showPassword).toBeTrue();
    componente.togglePasswordVisibility();
    expect(componente.showPassword).toBeFalse();
  });

  // ✅ 4. Método Guardar - Éxito en la autenticación
  it('Debe llamar a AuthService.login y guardar el token en caso de éxito (ADMINISTRADOR)', async () => {
    const respuestaMock = { Token: 'mockToken', Expira: new Date() };
    servicioAuth.login.and.returnValue(of(respuestaMock));    
    servicioAuth.getUserRole.and.returnValue('ADMINISTRADOR');

    componente.form.setValue({ usuario: 'admin', contraseña: 'password123' });
    await componente.Guardar(new Event('submit'));

    expect(servicioAuth.login).toHaveBeenCalled();
    expect(servicioAuth.saveToken).toHaveBeenCalledWith('mockToken');
    expect(servicioRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('Debe llamar a AuthService.login y guardar el token en caso de éxito (VISITANTE)', async () => {
    const respuestaMock = { Token: 'mockToken', Expira: new Date() };
    servicioAuth.login.and.returnValue(of(respuestaMock));
    servicioAuth.getUserRole.and.returnValue('VISITANTE');

    componente.form.setValue({ usuario: 'visitante', contraseña: 'password123' });
    await componente.Guardar(new Event('submit'));

    expect(servicioAuth.login).toHaveBeenCalled();
    expect(servicioAuth.saveToken).toHaveBeenCalledWith('mockToken');
    expect(servicioRouter.navigate).toHaveBeenCalledWith(['/map-public']);
  });

  // ✅ 5. Método Guardar - Manejo de errores
  it('Debe mostrar error si el inicio de sesión falla', async () => {
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
  
    servicioAuth.login.and.returnValue(throwError(() => new Error('Credenciales incorrectas')));
  
    componente.form.setValue({ usuario: 'usuarioIncorrecto', contraseña: 'claveIncorrecta' });
    await componente.Guardar(new Event('submit'));
  
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Error',
      text: 'Credenciales incorrectas o error en el servidor.'
    }));
  });

  it('Debe mostrar error si el servidor no devuelve un token', async () => {
    const swalSpy = spyOn(Swal, 'fire');
    servicioAuth.login.and.returnValue(of({ Token: '', Expira: new Date() } as LoginResponse));

    componente.form.setValue({ usuario: 'usuario', contraseña: 'password123' });
    await componente.Guardar(new Event('submit'));

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Error',
      text: 'El servidor no devolvió un token JWT'
    }));
  });

  // ✅ 6. Método mostrarError
  it('Debe llamar a Swal.fire cuando mostrarError es invocado', async () => {
    const swalSpy = spyOn(Swal, 'fire');
    await componente['mostrarError']('Mensaje de error');

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Error',
      text: jasmine.any(String) // ✅ Permite cualquier mensaje de error
    }));
  });

});
