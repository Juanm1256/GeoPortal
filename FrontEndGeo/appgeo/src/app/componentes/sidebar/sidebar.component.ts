import { Component, Input} from '@angular/core';
import { ThemeService } from '../../servicios/theme.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  @Input() isSidebarCollapsed = false;
  @Input() isSidebarGeo = false;

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    this.isSidebarGeo = !this.isSidebarGeo;
  }
  
  constructor(public themeService: ThemeService) {}
}