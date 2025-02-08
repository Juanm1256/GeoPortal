import { Component,EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importa CommonModule para usar directivas como *ngIf y *ngFor
import { RouterModule } from '@angular/router'; // Importa RouterModule para usar enlaces de navegación
import { ThemeService } from '../../servicios/theme.service';

@Component({
  selector: 'app-navbar',
  standalone: true, // Indica que este componente es independiente (standalone)
  imports: [CommonModule, RouterModule], // Importa los módulos necesarios
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // Usa styleUrls en lugar de styleUrl
})
export class NavbarComponent {
  constructor(public themeService: ThemeService) {} // Inyecta el servicio
  // Cambiar entre modo noche y modo día
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
  @Output() sidebarToggle = new EventEmitter<void>();

  toggleSidebar() {
    this.sidebarToggle.emit();
  }
}