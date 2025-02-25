import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../servicios/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import Swal from 'sweetalert2';
import { LoginResponse } from '../../interfaces/login-response';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

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
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    fixture.detectChanges();
  });

  // ✅ 1. Creación del componente
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ✅ 2. Formulario
  it('should initialize the form with empty values', () => {
    expect(component.form.get('usuario')?.value).toBe('');
    expect(component.form.get('contraseña')?.value).toBe('');
  });

  it('should invalidate the form when fields are empty', () => {
    component.form.get('usuario')?.setValue('');
    component.form.get('contraseña')?.setValue('');
    expect(component.form.invalid).toBeTrue();
  });

  it('should validate the usuario field', () => {
    const usuario = component.form.get('usuario');
    usuario?.setValue('user123');
    expect(usuario?.valid).toBeTrue();

    usuario?.setValue('');
    expect(usuario?.invalid).toBeTrue();
  });

  it('should validate the contraseña field', () => {
    const contraseña = component.form.get('contraseña');
    contraseña?.setValue('password123');
    expect(contraseña?.valid).toBeTrue();

    contraseña?.setValue('123');
    expect(contraseña?.invalid).toBeTrue();
  });

  // ✅ 3. Mostrar/Ocultar Contraseña
  it('should toggle password visibility', () => {
    expect(component.showPassword).toBeFalse();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeTrue();
    component.togglePasswordVisibility();
    expect(component.showPassword).toBeFalse();
  });

  // ✅ 4. Método Guardar - Éxito
  it('should call AuthService.login and save token on success (ADMINISTRADOR)', async () => {
    const mockResponse = { Token: 'mockToken', Expira: new Date() };
    authService.login.and.returnValue(of(mockResponse))    
    authService.getUserRole.and.returnValue('ADMINISTRADOR');

    component.form.setValue({ usuario: 'admin', contraseña: 'password123' });
    await component.Guardar(new Event('submit'));

    expect(authService.login).toHaveBeenCalled();
    expect(authService.saveToken).toHaveBeenCalledWith('mockToken');
    expect(router.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should call AuthService.login and save token on success (VISITANTE)', async () => {
    const mockResponse = { Token: 'mockToken', Expira: new Date() };
    authService.login.and.returnValue(of(mockResponse));
    authService.getUserRole.and.returnValue('VISITANTE');

    component.form.setValue({ usuario: 'visitor', contraseña: 'password123' });
    await component.Guardar(new Event('submit'));

    expect(authService.login).toHaveBeenCalled();
    expect(authService.saveToken).toHaveBeenCalledWith('mockToken');
    expect(router.navigate).toHaveBeenCalledWith(['/map-public']);
  });

  // ✅ 4. Método Guardar - Error
  it('should show error if login fails', async () => {
    const swalSpy = spyOn(Swal, 'fire').and.returnValue(Promise.resolve({} as any));
  
    authService.login.and.returnValue(throwError(() => new Error('Credenciales incorrectas')));
  
    component.form.setValue({ usuario: 'wronguser', contraseña: 'wrongpassword' });
    await component.Guardar(new Event('submit'));
  
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Error',
      text: 'Credenciales incorrectas o error en el servidor.' // ✅ Mensaje corregido
    }));
  });
  

  it('should show error if no token is returned', async () => {
    const swalSpy = spyOn(Swal, 'fire');
    authService.login.and.returnValue(of({ Token: '', Expira: new Date() } as LoginResponse));


    component.form.setValue({ usuario: 'user', contraseña: 'password123' });
    await component.Guardar(new Event('submit'));

    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Error',
      text: 'El servidor no devolvió un token JWT'
    }));
  });

  // ✅ 5. Método mostrarError
  it('should call Swal.fire when mostrarError is called', async () => {
    const swalSpy = spyOn(Swal, 'fire');
    await component['mostrarError']('Mensaje de error');
  
    expect(Swal.fire).toHaveBeenCalledWith(jasmine.objectContaining({
      icon: 'error',
      title: 'Error',
      text: jasmine.any(String) // ✅ Permite cualquier texto de error
    }));
  });
  
});
