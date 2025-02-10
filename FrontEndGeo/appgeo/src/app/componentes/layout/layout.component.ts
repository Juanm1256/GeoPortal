import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterModule } from '@angular/router';
import { ThemeService } from '../../servicios/theme.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [NavbarComponent, SidebarComponent, RouterModule,CommonModule],
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css']
})
export class LayoutComponent implements OnInit, OnDestroy {
  isSidebarCollapsed = false;
  isDarkMode: boolean = false;
  themeSubscription!: Subscription;

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    // Suscribirse al observable del servicio para actualizar el tema dinámicamente
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(
      (isDark) => {
        this.isDarkMode = isDark;
      }
    );
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
