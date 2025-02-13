import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../servicios/auth.service';
import { FormsModule } from '@angular/forms'; // ✅ FormsModule para usar [(ngModel)]

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  imports: [FormsModule] // ✅ Eliminamos NgIf porque no se usa
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    this.authService.login({ username: this.username, password: this.password }).subscribe(
      (response: any) => {  // <-- Cambio aquí (para aceptar cualquier estructura de respuesta)
        console.log('🟢 Respuesta del servidor:', response); // ✅ Debug
  
        const token = response.AccessToken || response.accessToken;  // <-- Captura en cualquier formato
  
        if (token) {
          this.authService.saveToken(token);
          this.router.navigate(['/dashboard']);
        } else {
          console.error('❌ Error: El servidor no devolvió un token JWT');
          alert('Error en la autenticación. Intenta de nuevo.');
        }
      },
      (error) => {
        console.error('🔴 Error en la petición:', error);
        alert('Credenciales incorrectas o error en el servidor.');
      }
    );
  }
}
