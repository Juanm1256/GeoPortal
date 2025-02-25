import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Login } from '../../interfaces/login';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule]
})
export class LoginComponent {
  showPassword: boolean = false;
  form: FormGroup;
  isLoading = false;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.form = this.fb.group({
      usuario: [
        '',
        [
          Validators.required,
          Validators.maxLength(50),
          Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ@#$%&._+-]+( [A-Za-z0-9ñÑáéíóúÁÉÍÓÚ@#$%&._+-]+)*$')
        ]
      ],
      contraseña: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.pattern('^[A-Za-z0-9ñÑáéíóúÁÉÍÓÚ@#$%&._+-]+( [A-Za-z0-9ñÑáéíóúÁÉÍÓÚ@#$%&._+-]+)*$')
        ]
      ]
    });
  }
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  async Guardar(event: Event): Promise<void> {
    event.preventDefault();
    this.form.markAllAsTouched();
    if (this.form.invalid) return;

    this.isLoading = true;
    document.body.style.cursor = 'wait';

    const login: Login = {
        Username: this.form.get('usuario')?.value,
        Password: this.form.get('contraseña')?.value,
        RefrescarToken: true
    };
    try {
        const response: any = await firstValueFrom(this.authService.login(login));
        

        const token = response.Token || response.token;
        if (token) {
            this.authService.saveToken(token);
            const userRole = this.authService.getUserRole();
            await Swal.fire({
                icon: 'success',
                title: '¡Acceso exitoso!',
                text: 'Usuario y contraseña correctos.',
                timer: 2000,
                showConfirmButton: false
            });
            if (userRole === 'ADMINISTRADOR') {
                this.router.navigate(['/dashboard']);
            } else if (userRole === 'VISITANTE') {
                this.router.navigate(['/map-public']);
            } else {
                console.warn('⚠️ Rol desconocido, redirigiendo a login');
                this.router.navigate(['/login']);
            }
        } else {
            console.error('❌ El servidor no devolvió un token JWT');
            await this.mostrarError('El servidor no devolvió un token JWT');
        }
    } catch (error) {
        console.error('❌ Error en la petición:', error);
        await this.mostrarError('Credenciales incorrectas o error en el servidor.');
    } finally {
        this.isLoading = false;
        document.body.style.cursor = 'default';
    }
}


  
  private async mostrarError(mensaje: string): Promise<void> {
    this.isLoading = false;
    document.body.style.cursor = 'default';
  
    await Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
    });
  }
  
}
