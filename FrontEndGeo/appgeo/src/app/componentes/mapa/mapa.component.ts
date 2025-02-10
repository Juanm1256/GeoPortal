import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-mapa',
  templateUrl: './mapa.component.html',
  styleUrls: ['./mapa.component.css']
})
export class MapaComponent implements OnInit {
  private map: L.Map | undefined;

  ngOnInit(): void {
    this.initMap();
  }

  private initMap(): void {
    // Inicializar el mapa y centrarlo en una ubicación específica
    this.map = L.map('map').setView([0, 0], 5); // Cambia la vista inicial si es necesario

    // Agregar la capa base de OpenStreetMap
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(this.map);
    // Capa WMS desde GeoServer
  L.tileLayer.wms('http://localhost:8085/geoserver/wms', {
    layers: 'workspace:mi_capa', // Cambia 'workspace:mi_capa' por el nombre real de tu capa
    format: 'image/png',
    transparent: true
  }).addTo(this.map);
  }
}
