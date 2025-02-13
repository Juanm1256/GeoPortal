import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms'; // ✅ FormsModule para usar [(ngModel)]
import { Login } from '../../interfaces/login';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [CommonModule,FormsModule, ReactiveFormsModule]
})
export class LoginComponent {

  form: FormGroup;

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

    const login: Login = {
          Username: this.form.get('usuario')?.value,
          Password: this.form.get('contraseña')?.value,
          RefrescarToken: true
        };
    //console.log(login);
    this.authService.login(login).subscribe(
      (response: any) => {
        //console.log('Respuesta del servidor:', response); 
        const token = response.Token || response.token;
  
        if (token) {
          this.authService.saveToken(token);
          this.router.navigate(['/dashboard']);
        } else {
          //console.error('Error: El servidor no devolvió un token JWT');
          alert('Error en la autenticación. Intenta de nuevo.');
        }
      },
      (error) => {
        //console.error('Error en la petición:', error);
        alert('Credenciales incorrectas o error en el servidor.');
      }
    );
  }
}
