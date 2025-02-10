import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ThemeService } from '../../servicios/theme.service';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit, OnDestroy {
  isDarkMode: boolean = false;
  themeSubscription!: Subscription;

  @Input() isSidebarCollapsed = false;
  @Input() isSidebarGeo = false;

  constructor(public themeService: ThemeService) {}

  ngOnInit() {
    // Suscribirse al observable del servicio
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(
      (isDark) => {
        this.isDarkMode = isDark;
      }
    );
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.isSidebarGeo = !this.isSidebarGeo;
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
}
