import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // ✅ FormsModule para usar [(ngModel)]
import { Login } from '../../interfaces/login';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule,FormsModule, ReactiveFormsModule]
})
export class LoginComponent {

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

  Guardar(): void {

    if (this.form.invalid) return;

    this.isLoading = true;
    document.body.style.cursor = 'wait';

    const login: Login = {
          Username: this.form.get('usuario')?.value,
          Password: this.form.get('contraseña')?.value,
          RefrescarToken: true
        };

    this.isLoading = true;
    document.body.style.cursor = 'wait';

    //console.log(login);
    this.authService.login(login).subscribe(
      (response: any) => {
        //console.log('Respuesta del servidor:', response); 
        const token = response.Token || response.token;
  
        if (token) {
          this.authService.saveToken(token);

          Swal.fire({
            icon: 'success',
            title: '¡Acceso exitoso!',
            text: 'Usuario y contraseña correctos.',
            timer: 2000,
            showConfirmButton: false
          });

          setTimeout(() => {
            this.router.navigate(['/dashboard']);
          }, 2000);
        } else {
          this.mostrarError('El servidor no devolvió un token JWT');
        }
      },
      (error) => {
        //console.error('Error en la petición:', error);
        this.mostrarError('Credenciales incorrectas o error en el servidor.');
      },
      () => {
        this.isLoading = false;
        document.body.style.cursor = 'default';
      }
    );
  }

  private mostrarError(mensaje: string) {
    this.isLoading = false;
    document.body.style.cursor = 'default';

    // ✅ Mostrar SweetAlert de error
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: mensaje
    });
  }
}
