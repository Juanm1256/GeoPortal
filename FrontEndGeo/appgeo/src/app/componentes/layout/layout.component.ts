import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../servicios/theme.service';
import { AuthService } from '../../servicios/auth.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RouterModule, CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  isDarkMode: boolean = false;
  themeSubscription!: Subscription;
  userRole: string | null = null; // ✅ Variable para el rol del usuario

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

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
