import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../servicios/theme.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isDarkMode: boolean = false;
  themeSubscription!: Subscription;
  userRole: string | null = null; // ✅ Variable para el rol del usuario

  @Output() sidebarToggle = new EventEmitter<void>();

  constructor(
    public themeService: ThemeService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(
      (isDark) => {
        this.isDarkMode = isDark;
      }
    );

    this.userRole = this.authService.getUserRole(); // ✅ Obtener el rol del usuario
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
