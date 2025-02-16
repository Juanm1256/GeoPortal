import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../servicios/theme.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../servicios/auth.service';
import {jwtDecode} from 'jwt-decode';
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  usuario: any = null;
  isDarkMode: boolean = false;
  themeSubscription!: Subscription;
  userRole: string | null = null; // ✅ Variable para el rol del usuario

  @Output() sidebarToggle = new EventEmitter<void>();

  constructor(
    public themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.obtenerDatosDesdeToken();
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(
      (isDark) => {
        this.isDarkMode = isDark;
      }
    );

    this.userRole = this.authService.getUserRole(); // ✅ Obtener el rol del usuario
  }
  obtenerDatosDesdeToken(): void {
    const token = this.authService.getToken();
    if (token) {
      try {
        this.usuario = jwtDecode(token);
      } catch (error) {
        console.error('❌ Error al decodificar el token:', error);
      }
    } else {
      console.warn('⚠️ No hay token disponible.');
    }
  }
  toggleTheme(event: Event) {
    event.preventDefault();
    this.themeService.toggleTheme();
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
