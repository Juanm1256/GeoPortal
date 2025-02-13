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

  @Output() sidebarToggle = new EventEmitter<void>();

  constructor(
    public themeService: ThemeService,
    private authService: AuthService) {}

  ngOnInit() {
    this.themeSubscription = this.themeService.isDarkMode$.subscribe(
      (isDark) => {
        this.isDarkMode = isDark;
      }
    );
  }

  toggleTheme(event: Event) {
    event.preventDefault();
    this.themeService.toggleTheme();
  }

  toggleSidebar() {
    this.sidebarToggle.emit();
  }

  ngOnDestroy() {
    this.themeSubscription.unsubscribe();
  }
  logout(): void {
    this.authService.logout();
  }
}
