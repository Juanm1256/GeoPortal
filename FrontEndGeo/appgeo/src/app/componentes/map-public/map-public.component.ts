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
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';
// @ts-ignore
import domtoimage from 'dom-to-image';
import { Metodos } from '../../../Metodos/metodos';
import * as bootstrap from 'bootstrap';
import Chart from 'chart.js/auto';
import { ThemeService } from '../../servicios/theme.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-map-public',
  imports: [CommonModule],
  templateUrl: './map-public.component.html',
  styleUrl: './map-public.component.css'
})
export class MapPublicComponent implements OnInit, OnDestroy {
  userRole: string | null = null;
  showSidebarButton: boolean = false;
  isDarkMode: boolean = false;
  themeSubscription!: Subscription;
  isGraphButtonVisible: boolean = false;
  modalInfo: { key: string; value: string }[] = [];
  sidebarOpen: boolean = false;
  layerInfo: { nombre: string; descripcion: string } | null = null;
  layerData: { label: string; value: number; color: string }[] = [];
  pieChart: any;
  private map!: L.Map;
  private metodos!: Metodos;
  private markerLayer = L.layerGroup();
  private markers: L.Marker[] = [];
  private capas: { [key: string]: L.Layer | L.LayerGroup } = {};
  activeLayers: { [key: string]: boolean } = {};
  private marcadorSeleccionado: L.Marker | null = null;
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
    private proveedorasistenciatecnicaservice: ProveedorasistenciatecnicaService,
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService
  ) {
    this.metodos = new Metodos();
  }
  goBack(): void {
    window.history.back();
  }

  logout(): void {
    this.authService.logout();
  }
  allowScroll(event: WheelEvent): void {
    const target = event.currentTarget as HTMLElement;

    if (target.scrollHeight > target.clientHeight) {
      event.stopPropagation();
    }
  }
  toggleTheme(event: Event) {
    event.preventDefault();
    this.themeService.toggleTheme();
  }
  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();

    (window as any).removeMarker = this.removeMarker.bind(this);
    this.initMap();
    this.checkGraphButtonVisibility();
    this.themeSubscription = this.themeService.isDarkMode$.subscribe((isDark) => {
      this.isDarkMode = isDark;
      console.log('🔹 Modo oscuro activado:', isDark); // <-- Verifica si aparece esto en la consola
    });
  }
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
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
    this.map.on('baselayerchange', () => {
      setTimeout(() => {
        Object.keys(this.capas).forEach(layerName => {
          if (this.capas[layerName]) {
            this.map.addLayer(this.capas[layerName]);
            if (this.capas[layerName] instanceof L.TileLayer.WMS) {
              (this.capas[layerName] as L.TileLayer.WMS).bringToFront();
            }
          }
        });
      }, 500);
    });
    // ✅ EVENTO UNIFICADO
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      console.log("🟢 Evento click detectado:", e.latlng);

      const activeLayer = Object.keys(this.activeLayers).find(layer => this.activeLayers[layer]);
      if (activeLayer) {
        console.log("🔹 Capa activa:", activeLayer);
        this.metodos.getFeatureInfo(activeLayer, e.latlng, this.map);
      } else {
        console.warn("⚠️ No hay capas activas en este momento.");
      }
    });
  }
  toggleSidebar() {
    console.log("🔹 toggleSidebar() llamado");
    console.log("🔹 showSidebarButton:", this.showSidebarButton);

    if (this.showSidebarButton) {
      this.sidebarOpen = !this.sidebarOpen;
      console.log("🔹 sidebarOpen:", this.sidebarOpen);

      if (this.sidebarOpen) {
        this.openSidebarWithLayerData('Textura del Suelo');  // 🔥 Llama esta función aquí
        setTimeout(() => this.showPieChart(), 300);
      } else {
        if (this.pieChart) {
          this.pieChart.destroy();
        }
      }
    } else {
      console.warn("⚠️ showSidebarButton es falso. El panel no se mostrará.");
    }
  }
  isAnyLayerActive(): boolean {
    const activeLayers = [
      'Textura_suelo_0', 'Textura_suelo_10',
      'Textura_suelo_30', 'Textura_suelo_60', 'Textura_suelo_100', 'Textura_suelo_200'
    ];
    console.log("🔹 isAnyLayerActive():", activeLayers.some(layer => this.activeLayers[layer]));
    return activeLayers.some(layer => this.activeLayers[layer]);
  }

  openSidebarWithLayerData(layerName: string) {
    // Simular los datos de ejemplo
    const TexturaBDejemplo = [
      { value: 9, porcentaje: 1.5 },
      { value: 8, porcentaje: 0.0 },
      { value: 7, porcentaje: 23.7 },
      { value: 6, porcentaje: 51.5 },
      { value: 4, porcentaje: 22.8 },
      { value: 3, porcentaje: 0.0 },
      { value: 1, porcentaje: 0.1 },
      { value: 0, porcentaje: 0.4 }
    ];
    // Mapa de colores según el value
    const colorMap: { [key: number]: string } = {
      0: '#ca7173',
      1: '#430bea',
      3: '#ffe605',
      4: '#16efdd',
      6: '#c7b4ff',
      7: '#617ece',
      8: '#073408',
      9: '#dc1010'
    };
    // Actualizar la información en el panel lateral
    this.layerInfo = {
      nombre: layerName,
      descripcion: `Gráfico de distribución de la textura del suelo para la capa ${layerName}`
    };

    // Asignar los datos al gráfico
    this.layerData = TexturaBDejemplo.map((item, index) => ({
      label: `Valor ${item.value}`,
      value: item.porcentaje,
      color: colorMap[item.value] || '#cccccc' // Color por defecto si no hay coincidencia
    }));
    // Llamar a la función para mostrar el gráfico
    setTimeout(() => this.showPieChart(), 300);
  }


  private showPieChart() {
    console.log("🔹 showPieChart() llamado");
    console.log("🔹 Datos para el gráfico:", this.layerData);

    if (this.pieChart) {
      this.pieChart.destroy();
    }

    const canvas = document.getElementById('pieChart') as HTMLCanvasElement;

    if (canvas) {
      const ctx = canvas.getContext('2d');

      if (ctx && this.layerData.length > 0) {
        this.pieChart = new Chart(ctx, {
          type: 'pie',
          data: {
            labels: this.layerData.map(d => d.label),
            datasets: [{
              data: this.layerData.map(d => d.value),
              backgroundColor: this.layerData.map(d => d.color),
              hoverOffset: 8
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });

        console.log("✅ Gráfico creado con éxito.");
      } else {
        console.warn("⚠️ No hay datos para mostrar el gráfico.");
      }
    } else {
      console.warn("⚠️ No se encontró el canvas para el gráfico de torta.");
    }
  }


  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  toggleLayers() {
    this.isLayersOpen = !this.isLayersOpen;
  }

  toggleLayer(layerName: string, event: any) {
    const button = event.target.closest('.layer-btn');

    // Cerrar el panel lateral al cambiar de capa
    this.sidebarOpen = false;
    if (this.pieChart) this.pieChart.destroy(); // Destruir el gráfico si existe

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
        case 'Fragmentos_gruesos_suelo':
          this.capas[layerName] = this.metodos.cargarfragmentosgruesossuelo(this.map);
          break;
        case 'pH_suelo':
          this.capas[layerName] = this.metodos.cargarph_suelo(this.map);
          break;
        case 'Textura_suelo_0':
          this.capas[layerName] = this.metodos.cargarTexturasuelo0(this.map);
          this.openSidebarWithLayerData(layerName); // Mostrar gráfico de torta
          break;
        case 'Textura_suelo_10':
          this.capas[layerName] = this.metodos.cargarTexturasuelo10(this.map);
          this.openSidebarWithLayerData(layerName); // Mostrar gráfico de torta
          break;
        case 'Textura_suelo_30':
          this.capas[layerName] = this.metodos.cargarTexturasuelo30(this.map);
          this.openSidebarWithLayerData(layerName); // Mostrar gráfico de torta
          break;
        case 'Textura_suelo_60':
          this.capas[layerName] = this.metodos.cargarTexturasuelo60(this.map);
          this.openSidebarWithLayerData(layerName); // Mostrar gráfico de torta
          break;
        case 'Textura_suelo_100':
          this.capas[layerName] = this.metodos.cargarTexturasuelo100(this.map);
          this.openSidebarWithLayerData(layerName); // Mostrar gráfico de torta
          break;
        case 'Textura_suelo_200':
          this.capas[layerName] = this.metodos.cargarTexturasuelo200(this.map);
          this.openSidebarWithLayerData(layerName); // Mostrar gráfico de torta
          break;
      }

      this.map.addLayer(this.capas[layerName]);

      if (this.capas[layerName] instanceof L.TileLayer.WMS) {
        (this.capas[layerName] as L.TileLayer.WMS).bringToFront();
      }

      this.activeLayers[layerName] = true;
      button.classList.add('active');
    } else {
      this.map.removeLayer(this.capas[layerName]);
      delete this.capas[layerName];
      this.activeLayers[layerName] = false;
      button.classList.remove('active');

      if (layerName === 'modgene' && this.marcadorSeleccionado) {
        this.map.removeLayer(this.marcadorSeleccionado);
        this.marcadorSeleccionado = null;
      }
    }

    this.checkGraphButtonVisibility();
  }


  checkGraphButtonVisibility() {
    const activeLayers = [
      'Textura_suelo_0', 'Textura_suelo_10', 'Textura_suelo_30',
      'Textura_suelo_60', 'Textura_suelo_100', 'Textura_suelo_200'];
    this.showSidebarButton = activeLayers.some(layer => this.activeLayers[layer]);
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
      iconUrl: 'assets/leaflet/marker-icon-red.png',

      iconSize: [32, 40],
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

        if (this.marcadorSeleccionado) {
          this.map.removeLayer(this.marcadorSeleccionado);
          this.marcadorSeleccionado = null;
        }

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
    if (!this.capas['modgene'] || !this.map.hasLayer(this.capas['modgene'])) {
      return;
    }

    const latlng = event.latlng;
    const url = this.construirUrlGetFeatureInfo(latlng, this.map.getBounds());


    fetch(url)
      .then(response => {
        const contentType = response.headers.get('content-type');

        if (contentType && contentType.includes('application/json')) {
          return response.json();
        } else {
          return response.text().then(text => {

          });
        }
      })
      .then(data => {
        if (data?.features?.length > 0) {
          const feature = data.features[0];

          this.mostrarModalInformacion(feature.properties);

          this.agregarMarcador(latlng, feature.properties);
        }
      });
  }



  construirUrlGetFeatureInfo(latlng: L.LatLng, bbox: L.LatLngBounds): string {
    return `http://localhost:8085/geoserver/capas_rastergeo/ows?` +
      `service=WFS&` +
      `version=1.0.0&` +
      `request=GetFeature&` +
      `typeName=capas_rastergeo:Mod_general_ajustado&` +
      `outputFormat=application/json&` +
      `srsName=EPSG:4326&` +
      `CQL_FILTER=INTERSECTS(geom, POINT(${latlng.lng} ${latlng.lat}))`;
  }

  agregarMarcador(latlng: L.LatLng, propiedades: { [key: string]: any }) {
    if (!this.capas['modgene'] || !this.map.hasLayer(this.capas['modgene'])) {
      return;
    }

    const customIcon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon-red.png',
      iconSize: [32, 40],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    if (this.marcadorSeleccionado) {
      this.map.removeLayer(this.marcadorSeleccionado);
    }

    this.marcadorSeleccionado = L.marker(latlng, { icon: customIcon })
      .bindPopup(`<b>Información de la Capa</b><br>Ubicación: ${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`)
      .addTo(this.map)
      .openPopup();
  }

  mostrarModalInformacion(propiedades: { [key: string]: any }) {
    this.modalInfo = Object.entries(propiedades).map(([key, value]) => ({
      key,
      value: value !== null ? value.toString() : 'N/A'
    }));

    setTimeout(() => {
      const modalElement = document.getElementById('datosModal');
      if (modalElement) {
        const modal = new bootstrap.Modal(modalElement);
        modal.show();
      }
    }, 200);
  }

  cerrarModal() {
    this.modalInfo = [];
  }

  
}