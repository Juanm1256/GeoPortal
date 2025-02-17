import { Component, OnInit, OnDestroy } from '@angular/core';
import * as L from 'leaflet';
import { CapitalesDepartamentalesService } from '../../servicios/maps/capitales-departamentales.service';
import { CuencasService } from '../../servicios/maps/cuencas.service';
import { LimitesDepartamentalesService } from '../../servicios/maps/limites-departamentales.service';
import { LimitesMunicipalesService } from '../../servicios/maps/limites-municipales.service';
import { MercadosService } from '../../servicios/maps/mercados.service';
import { ProveedoralevinesService } from '../../servicios/maps/proveedoralevines.service';
import { ProveedoralimentosService } from '../../servicios/maps/proveedoralimentos.service';
import { ProveedorasistenciatecnicaService } from '../../servicios/maps/proveedorasistenciatecnica.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
// @ts-ignore
import domtoimage from 'dom-to-image';
import { Metodos } from '../../../Metodos/metodos';

@Component({

  selector: 'app-map-private',
  imports: [CommonModule],
  templateUrl: './map-private.component.html',
  styleUrl: './map-private.component.css'
})
export class MapPrivateComponent implements OnInit, OnDestroy {
  private map!: L.Map;
  private metodos!: Metodos;
  private markerLayer = L.layerGroup();
  private markers: L.Marker[] = [];
  private capas: { [key: string]: L.Layer | L.LayerGroup} = {};
  activeLayers: { [key: string]: boolean } = {};
  modalInfo: { key: string, value: string }[] | null = null;

  private baseMaps: { [key: string]: L.TileLayer } = {};
  private baseMapNames: Map<L.TileLayer, string> = new Map();
  private activeBaseLayer!: L.TileLayer;

  isAccordionOpen = false;
  isLayersOpen = false;

  constructor(
    private cap_depservice: CapitalesDepartamentalesService,
    private cuencasService: CuencasService,
    private limitesdepservice: LimitesDepartamentalesService,
    private limitesmuservice: LimitesMunicipalesService,
    private mercadoservices: MercadosService,
    private proveedoralevinesservice: ProveedoralevinesService,
    private proveedoralimentoservice: ProveedoralimentosService,
    private proveedorasistenciatecnicaservice: ProveedorasistenciatecnicaService
  ) {

    this.metodos = new Metodos();
  }
  allowScroll(event: WheelEvent): void {
    const target = event.currentTarget as HTMLElement;
  
    if (target.scrollHeight > target.clientHeight) {
      event.stopPropagation();
    }
  }
  ngOnInit(): void {
    (window as any).removeMarker = this.removeMarker.bind(this);
    this.initMap();
  }

  private initMap(): void {
    this.map = L.map('map-private', {
      center: [-16.54529, -64.7400],
      zoom: 6,
      zoomControl: false
    });

    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18 });
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 });
    const topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 });
    const carto = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', { maxZoom: 18 });

    this.baseMaps = { "Mapa OSM": osm, "Satélite": satellite, "Topográfico": topo, "Cartográfico": carto };
    this.baseMapNames.set(osm, "Mapa OSM");
    this.baseMapNames.set(satellite, "Satélite");
    this.baseMapNames.set(topo, "Topográfico");
    this.baseMapNames.set(carto, "Cartográfico");

    osm.addTo(this.map);
    this.activeBaseLayer = osm;

    L.control.layers(this.baseMaps).addTo(this.map);
    this.map.on('click', this.consultarInformacionFeature.bind(this));
  }

  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  toggleLayers() {
    this.isLayersOpen = !this.isLayersOpen;
  }


  toggleLayer(layerName: string, event: any) {
    const button = event.target.closest('.layer-btn');
    
    if (!this.capas[layerName]) {
      switch (layerName) {
        case 'cuencas': 
          this.capas[layerName] = this.metodos.CargarCuencas(this.map, this.cuencasService); 
          break;
        case 'mercados': 
          this.capas[layerName] = this.metodos.Cargarmercados(this.map, this.mercadoservices);
          break;
        case 'capitalesDepartamentales':
          this.capas[layerName] = this.metodos.CargarCapitalesDepartamentales(this.map, this.cap_depservice); 
          break;
        case 'limitesDepartamentales': 
          this.capas[layerName] = this.metodos.CargarLimitesDepartamentales(this.map, this.limitesdepservice);
          break;
        case 'limitesMunicipales':
          this.capas[layerName] = this.metodos.CargarLimitesMunicipales(this.map, this.limitesmuservice);
          break;
        case 'proveedorAlevines': 
          this.capas[layerName] = this.metodos.CargarProveedorAlevines(this.map, this.proveedoralevinesservice); 
          break;
        case 'proveedorAlimentos': 
          this.capas[layerName] = this.metodos.CargarProveedorAlimentos(this.map, this.proveedoralimentoservice); 
          break;
        case 'proveedorAsistenciaTecnica': 
          this.capas[layerName] = this.metodos.CargarProveedoresAsistenciaTecnica(this.map, this.proveedorasistenciatecnicaservice);
          break;
        case 'redCaminos': 
          this.capas[layerName] = this.metodos.CargarRedCaminos(this.map); 
          break;
        case 'redHidrica': 
          this.capas[layerName] = this.metodos.CargarRedHidrica(this.map); 
          break;
        case 'modgene': 
          this.capas[layerName] = this.metodos.cargarmodgene(this.map); 
          break;
      }
    
      this.activeLayers[layerName] = true;
      button.classList.add('active');
    } else {
      this.map.removeLayer(this.capas[layerName]);
      delete this.capas[layerName];
      this.activeLayers[layerName] = false;
      button.classList.remove('active');
    }
  }
  
  getUserLocation() {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      this.map.setView([latitude, longitude], 15);
    });
  }

  mapZoomIn() {
    this.map.zoomIn();
  }

  mapZoomOut() {
    this.map.zoomOut();
  }

  toggleBaseMap() {
    const baseLayers = Array.from(this.baseMapNames.values());
    let currentIndex = baseLayers.indexOf(this.baseMapNames.get(this.activeBaseLayer)!);
    const nextIndex = (currentIndex + 1) % baseLayers.length;
    const nextLayerName = baseLayers[nextIndex];

    this.map.removeLayer(this.activeBaseLayer);
    this.activeBaseLayer = this.baseMaps[nextLayerName];
    this.map.addLayer(this.activeBaseLayer);
  }

  /*** MARCADORES ***/
  addCustomMarker() {
    const center = this.map.getCenter();
    const { lat, lng } = center;

    const customIcon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon-2x.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    const marker = L.marker([lat, lng], { draggable: true, icon: customIcon });

    // **Función para actualizar el popup con la nueva posición**
    const updatePopup = () => {
      const newLatLng = marker.getLatLng();
      marker.setPopupContent(`
        <div style="text-align: center; display: flex; flex-direction: column; align-items: center;">
          <p>Marcador en:</p>
          <p><strong>Lat:</strong> ${newLatLng.lat.toFixed(5)}, <strong>Lng:</strong> ${newLatLng.lng.toFixed(5)}</p>
          <button class="delete-marker-btn" style="background: red; color: white; padding: 8px 12px; cursor: pointer;">
            Eliminar Marcador
          </button>
        </div>
      `);
    };

    marker.bindPopup(`
      <div style="text-align: center; display: flex; flex-direction: column; align-items: center;">
        <p>Marcador en:</p>
        <p><strong>Lat:</strong> ${lat.toFixed(5)}, <strong>Lng:</strong> ${lng.toFixed(5)}</p>
        <button class="delete-marker-btn" style="background: red; color: white; padding: 8px 12px; cursor: pointer;">
          Eliminar Marcador
        </button>
      </div>
    `);

    // **Actualizar el popup cuando el marcador se mueva**
    marker.on('dragend', updatePopup);

    marker.addTo(this.markerLayer);
    this.markerLayer.addTo(this.map);
    this.markers.push(marker);

    marker.on("popupopen", () => {
      const deleteBtn = document.querySelector(".delete-marker-btn") as HTMLButtonElement;
      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => this.removeMarker(marker));
      }
    });
  }


  removeMarker(marker: L.Marker) {
    this.map.removeLayer(marker);
    this.markers = this.markers.filter(m => m !== marker);
  }

  captureMap() {
    const mapElement = document.getElementById('map-private');
    if (!mapElement) {
        console.error("No se encontró el mapa");
        return;
    }

    const width = mapElement.scrollWidth;
    const height = mapElement.scrollHeight;
    const scaleFactor = Math.max(window.devicePixelRatio || 1, 1);
      domtoimage.toPng(mapElement, {
          quality: 1,
          bgcolor: '#fff',
          style: {
            transform: `scale(${scaleFactor})`,
            'transform-origin': 'top left',
            width: `${width * scaleFactor}px`,
            height: `${height * scaleFactor}px`
          }
      })
      .then((dataUrl: string) => {
          const link = document.createElement('a');
          link.href = dataUrl;
          link.download = `mapa_${new Date().getTime()}.png`;
          link.click();
      })
      .catch((error: any) => {
          console.error('Error al capturar el mapa:', error);
      });
  }
  
   resetMapView() {
    Swal.fire({
      title: "¿Restablecer el mapa?",
      text: "Se restablecerán todas las capas y volverás a la vista inicial.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, restablecer",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        this.map.setView([-16.54529, -64.7400], 6);

        this.markerLayer.clearLayers();

        Object.keys(this.capas).forEach(layerName => {
          if (this.capas[layerName]) {
            this.map.removeLayer(this.capas[layerName]);
          }
        });

        this.capas = {};
        this.activeLayers = {};

        this.map.eachLayer(layer => {
          if (layer instanceof L.TileLayer) {
            this.map.removeLayer(layer);
          }
        });
        this.activeBaseLayer = this.baseMaps["Mapa OSM"];
        this.map.addLayer(this.activeBaseLayer);

        document.querySelectorAll(".layer-btn").forEach(btn => {
          btn.classList.remove("active");
        });

        Swal.fire(
          "Mapa Restablecido",
          "El mapa ha vuelto a su estado inicial.",
          "success"
        );
      }
    });
  }

  restoreLayerButtonStyles() {
    setTimeout(() => {
      document.querySelectorAll('.layer-btn').forEach(button => {
        const layerName = button.getAttribute('data-layer');
        if (layerName && this.activeLayers[layerName]) {
          button.classList.add('active');
        }
      });
    }, 100);
  }
  
  consultarInformacionFeature(event: L.LeafletMouseEvent) {
      const latlng = event.latlng;
      const url = this.construirUrlGetFeatureInfo(latlng, this.map.getBounds());
      
      console.log('URL de consulta:', url);
    
      fetch(url)
        .then(response => {
          const contentType = response.headers.get('content-type');
          
          if (contentType && contentType.includes('application/json')) {
            return response.json();
          } else {
            return response.text().then(text => {
              console.error('Respuesta de error:', text);
              throw new Error('Error en la consulta WFS: ' + text);
            });
          }
        })
        .then(data => {
          if (data?.features?.length > 0) {
            const feature = data.features[0];
            this.mostrarModalInformacion(feature.properties);
          } else {
            console.log('No se encontró información en esta ubicación');
          }
        })
        .catch(error => {
          console.error('Error al consultar información:', error);
        });
    }
    
    construirUrlGetFeatureInfo(latlng: L.LatLng, bbox: L.LatLngBounds): string {
      return `http://localhost:8085/geoserver/capas_rastergeo/ows?` +
        `service=WFS&` +
        `version=1.0.0&` +
        `request=GetFeature&` +
        `typeName=capas_rastergeo:mod_gen_ajustado&` +
        `outputFormat=application/json&` +
        `srsName=EPSG:4326&` +
        `CQL_FILTER=INTERSECTS(geom, POINT(${latlng.lng} ${latlng.lat}))`;
    }
  
  mostrarModalInformacion(propiedades: { [key: string]: any }) {
    this.modalInfo = Object.entries(propiedades).map(([key, value]) => ({
      key,
      value: value !== null ? value.toString() : 'N/A'
    }));
  }

  cerrarModal() {
    this.modalInfo = null;
  }

  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
  }
}