import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map-public',
  imports: [],
  templateUrl: './map-public.component.html',
  styleUrl: './map-public.component.css'
})
export class MapPublicComponent implements OnInit {
  private map!: L.Map;

  constructor() {}

  ngOnInit(): void {
    this.initMap();
  }

  // Inicializar el mapa
  initMap(): void {
    this.map = L.map('map-public').setView([-16.54529, -64.7400], 6);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);
  }
}
