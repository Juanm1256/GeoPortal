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
import * as bootstrap from 'bootstrap';
import Chart from 'chart.js/auto';
import { ThemeService } from '../../servicios/theme.service';
import { debounceTime, distinctUntilChanged, firstValueFrom, Observable, of, Subscription, switchMap } from 'rxjs';
import { TexturasService } from '../../servicios/maps/texturas.service';
import { Texturas } from '../../interfaces/texturas';
import { DepartamentoinfoService } from '../../servicios/maps/departamentoinfo.service';
import { DepartamentoInforDTO } from '../../interfaces/departamento-infor-dto';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { LimitesMunicipales } from '../../interfaces/limites-municipales';

@Component({
  selector: 'app-map-private',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './map-private.component.html',
  styleUrl: './map-private.component.css'
})
export class MapPrivateComponent implements OnInit, OnDestroy {

  searchControl = new FormControl();
  filteredMunicipios: LimitesMunicipales[] = [];
  isSearching = false;
  private searchMarker: L.Marker | null = null;
  private limitesMunicipalesHighlight: L.LayerGroup | null = null;

  isDarkMode: boolean = false;
  themeSubscription!: Subscription;
  showSidebarButton: boolean = false;
  isGraphButtonVisible: boolean = false;
  modalInfo: { key: string; value: string }[] = [];
  showModal = false;
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
    private texturaservice: TexturasService,
    private departamentoService: DepartamentoinfoService,
    private themeService: ThemeService
  ) {
    this.metodos = new Metodos();
  }
  allowScroll(event: WheelEvent): void {
    const target = event.currentTarget as HTMLElement;
    if (target.scrollHeight > target.clientHeight) {
      event.stopPropagation();
    }
  }
  async ngOnInit(): Promise<void> {
    try {
      (window as any).removeMarker = this.removeMarker.bind(this);
      await this.initMap();
      this.initSearch();
      this.checkGraphButtonVisibility();
      this.makeModalDraggable();
      this.themeSubscription = this.themeService.isDarkMode$.subscribe((isDark) => {
        this.isDarkMode = isDark;
      });
    } catch (error) {
    }
  }
  ngOnDestroy() {
    if (this.map) {
      this.map.remove();
    }
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
  public disableMapInteractions(): void {
    if (this.map) {
      this.map.dragging.disable(); 
      this.map.scrollWheelZoom.disable(); 
      this.map.doubleClickZoom.disable(); 
      this.map.boxZoom.disable(); 
      this.map.keyboard.disable(); 
      this.map.off('click'); 
    }
  }

  public enableMapInteractions(): void {
    if (this.map) {
      this.map.dragging.enable();
      this.map.scrollWheelZoom.enable();
      this.map.doubleClickZoom.enable();
      this.map.boxZoom.enable();
      this.map.keyboard.enable();
      this.map.on('click', this.consultarInformacionFeature.bind(this)); // Reasigna el evento de clic
    }
  }
  makeModalDraggable(): void {
    const modal = document.getElementById('datosModal') as HTMLElement;
    const header = document.getElementById('modalHeader') as HTMLElement;

    if (!modal || !header) return;

    let offsetX = 0, offsetY = 0, posX = 0, posY = 0;

    header.onmousedown = (e: MouseEvent) => {
      e.preventDefault();
      offsetX = e.clientX - modal.getBoundingClientRect().left;
      offsetY = e.clientY - modal.getBoundingClientRect().top;

      document.onmousemove = (event: MouseEvent) => {
        posX = event.clientX - offsetX;
        posY = event.clientY - offsetY;

        modal.style.left = `${posX}px`;
        modal.style.top = `${posY}px`;
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }
  private async initMap(): Promise<void> {
    try {
      this.map = L.map('map-private', {
        center: [-16.54529, -64.7400],
        zoom: 6,
        zoomControl: false,
        dragging: true,   
        boxZoom: true,    
        doubleClickZoom: true,
        scrollWheelZoom: true,
        touchZoom: true
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

      await new Promise<void>((resolve) => {
        osm.on('load', () => resolve());
        osm.addTo(this.map);
      });

      this.activeBaseLayer = osm;
      L.control.layers(this.baseMaps).addTo(this.map);
      this.setupMapEventListeners();
    } catch (error) {
      throw error;
    }
  }

  private setupMapEventListeners(): void {
    this.map.on('baselayerchange', async () => {
      try {
        await new Promise<void>((resolve) => {
          setTimeout(async () => {
            for (const layerName of Object.keys(this.capas)) {
              if (this.capas[layerName]) {
                this.map.addLayer(this.capas[layerName]);
                if (this.capas[layerName] instanceof L.TileLayer.WMS) {
                  (this.capas[layerName] as L.TileLayer.WMS).bringToFront();
                }
              }
            }
            resolve();
          }, 500);
        });
      } catch (error) {
      }
    });

    this.map.on('click', async (e: L.LeafletMouseEvent) => {
      const activeLayer = Object.keys(this.activeLayers).find(layer => this.activeLayers[layer]);
      if (activeLayer) {
        try {
          this.map.on('click', async (e: L.LeafletMouseEvent) => {
            const activeLayer = Object.keys(this.activeLayers).find(layer => this.activeLayers[layer]);
            if (activeLayer) {
              try {
                await this.consultarInformacionFeature(e);
              } catch (error) {
              }
            }
          });
        } catch (error) {
        }
      }
    });
  }

  toggleSidebar() {
    if (this.showSidebarButton) {
      this.sidebarOpen = !this.sidebarOpen;

      if (this.sidebarOpen) {
        this.openSidebarWithLayerData('Textura del Suelo');
        setTimeout(() => this.showPieChart(), 300);
      } else {
        if (this.pieChart) {
          this.pieChart.destroy();
        }
      }
    } else {
    }
  }
  isAnyLayerActive(): boolean {
    const activeLayers = [
      'Textura_suelo_0', 'Textura_suelo_10',
      'Textura_suelo_30', 'Textura_suelo_60', 'Textura_suelo_100', 'Textura_suelo_200'
    ];
    return activeLayers.some(layer => this.activeLayers[layer]);
  }

  async openSidebarWithLayerData(layerName: string): Promise<void> {
    try {
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
  
      const textureNameMap: { [key: number]: string } = {
        0: 'No dato',
        1: 'Arcilloso',
        3: 'Arcillo arenoso',
        4: 'Franco Arcilloso',
        6: 'Franco Arcillo Arenoso',
        7: 'Franco',
        8: 'Franco Limoso',
        9: 'Franco Arenoso'
      };
  
      const layerMap: { [key: string]: () => Observable<Texturas[]> } = {
        'Textura_suelo_0': () => this.texturaservice.ListarTexturasuelocero(),
        'Textura_suelo_10': () => this.texturaservice.ListarTexturasuelodiez(),
        'Textura_suelo_30': () => this.texturaservice.ListarTexturasuelotreinta(),
        'Textura_suelo_60': () => this.texturaservice.ListarTexturasuelosesenta(),
        'Textura_suelo_100': () => this.texturaservice.ListarTexturasuelocien(),
        'Textura_suelo_200': () => this.texturaservice.ListarTexturasuelodoscientos()
      };
  
      this.layerInfo = {
        nombre: layerName,
        descripcion: `Gráfico de distribución de la textura del suelo para la capa ${layerName}`
      };
  
      if (layerMap[layerName]) {
        const data = await firstValueFrom(layerMap[layerName]());
        if (data && data.length > 0) {
          this.layerData = data.map(item => ({
            label: textureNameMap[item.Value] || `Valor ${item.Value}`,
            value: item.Porcentaje,
            color: colorMap[item.Value] || '#cccccc'
          }));
          await this.showPieChart();
        }
      }
    } catch (error) {
    }
  }


  private async showPieChart(): Promise<void> {
    try {
      if (this.pieChart) {
        this.pieChart.destroy();
      }

      const canvas = document.getElementById('pieChart') as HTMLCanvasElement;
      if (!canvas) {
        throw new Error('No se encontró el canvas para el gráfico');
      }

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
      }
    } catch (error) {
    }
  }


  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  toggleLayers() {
    this.isLayersOpen = !this.isLayersOpen;
    if (this.isLayersOpen) {
        this.restoreLayerButtonStyles(); 
    }
}
async toggleLayer(layerName: string, event: any): Promise<void> {
    const button = event.target.closest('.layer-btn');
    this.sidebarOpen = false;
    if (this.pieChart) this.pieChart.destroy();

    try {
      if (!this.capas[layerName]) {
        const layer = await this.loadLayer(layerName);
        if (layer) {
          this.capas[layerName] = layer;
          this.map.addLayer(this.capas[layerName]);

          if (this.capas[layerName] instanceof L.TileLayer.WMS) {
            (this.capas[layerName] as L.TileLayer.WMS).bringToFront();
          }

          this.activeLayers[layerName] = true;
          button.classList.add('active');

          if (layerName.startsWith('Textura_suelo_')) {
            await this.openSidebarWithLayerData(layerName);
          }
        }
      } else {
        this.map.removeLayer(this.capas[layerName]);
        delete this.capas[layerName];
        this.activeLayers[layerName] = false;
        button.classList.remove('active');

        if (layerName === 'modgene' && this.marcadorSeleccionado) {
          this.map.removeLayer(this.marcadorSeleccionado);
          this.marcadorSeleccionado = null;
        }

        const capasValidas = ['modgene', 'cuencas', 'limitesDepartamentales', 'limitesMunicipales', 'redCaminos', 'redHidrica'];
        const capaActiva = capasValidas.some(capa => this.capas[capa] && this.map.hasLayer(this.capas[capa]));

        if (!capaActiva && this.marcadorSeleccionado) {
          this.map.removeLayer(this.marcadorSeleccionado);
          this.marcadorSeleccionado = null;
        }
      }

      this.checkGraphButtonVisibility();
    } catch (error) {
    }
  }
  private async loadLayer(layerName: string): Promise<L.Layer | L.LayerGroup> {
    try {
      let layer: L.Layer | L.LayerGroup;
      this.setMapLoadingCursor(true);
      switch (layerName) {
        case 'cuencas':
          layer = await this.metodos.CargarCuencas(this.map, this.cuencasService, this.setMapLoadingCursor.bind(this));
          break;
        case 'mercados':
          layer = await this.metodos.Cargarmercados(this.map, this.mercadoservices, this.setMapLoadingCursor.bind(this));
          break;
        case 'capitalesDepartamentales':
          layer = await this.metodos.CargarCapitalesDepartamentales(this.map, this.cap_depservice, this.setMapLoadingCursor.bind(this));
          break;
        case 'limitesDepartamentales':
          layer = await this.metodos.CargarLimitesDepartamentales(this.map, this.limitesdepservice, this.setMapLoadingCursor.bind(this));
          break;
        case 'limitesMunicipales':
          layer = await this.metodos.CargarLimitesMunicipales(this.map, this.limitesmuservice, this.setMapLoadingCursor.bind(this));
          break;
        case 'proveedorAlevines':
          layer = await this.metodos.CargarProveedorAlevines(this.map, this.proveedoralevinesservice, this.setMapLoadingCursor.bind(this));
          break;
        case 'proveedorAlimentos':
          layer = await this.metodos.CargarProveedorAlimentos(this.map, this.proveedoralimentoservice, this.setMapLoadingCursor.bind(this));
          break;
        case 'proveedorAsistenciaTecnica':
          layer = await this.metodos.CargarProveedoresAsistenciaTecnica(this.map, this.proveedorasistenciatecnicaservice, this.setMapLoadingCursor.bind(this));
          break;
        case 'redCaminos':
          layer = await this.metodos.CargarRedCaminos(this.map);
          break;
        case 'redHidrica':
          layer = await this.metodos.CargarRedHidrica(this.map);
          break;
        case 'modgene':
          layer = await this.metodos.cargarmodgene(this.map);
          break;
        case 'Fragmentos_gruesos_suelo':
          layer = await this.metodos.cargarfragmentosgruesossuelo(this.map);
          break;
        case 'pH_suelo':
          layer = await this.metodos.cargarph_suelo(this.map);
          break;
        case 'Textura_suelo_0':
          layer = await this.metodos.cargarTexturasuelo0(this.map);
          break;
        case 'Textura_suelo_10':
          layer = await this.metodos.cargarTexturasuelo10(this.map);
          break;
        case 'Textura_suelo_30':
          layer = await this.metodos.cargarTexturasuelo30(this.map);
          break;
        case 'Textura_suelo_60':
          layer = await this.metodos.cargarTexturasuelo60(this.map);
          break;
        case 'Textura_suelo_100':
          layer = await this.metodos.cargarTexturasuelo100(this.map);
          break;
        case 'Textura_suelo_200':
          layer = await this.metodos.cargarTexturasuelo200(this.map);
          break;
        case 'Cobertura_uso_suelo':
          layer = await this.metodos.cargarCobertura_uso_suelo(this.map);
          break;
        case 'Textura':
          layer = await this.metodos.cargarTextura(this.map);
          break;
        case 'Precipitacion':
          layer = await this.metodos.cargarPrecipitacion(this.map);
          break;
        case 'Temperaturamedia':
          layer = await this.metodos.cargarTemperaturamedia(this.map);
          break;
        case 'estanques':
          layer = await this.metodos.cargarestanques(this.map);
          break;
        case 'Pendiente':
          layer = await this.metodos.cargarPendientes(this.map);
          break;
        default:
          throw new Error(`Capa no reconocida: ${layerName}`);
      }

      if (!layer) {
        throw new Error(`No se pudo cargar la capa: ${layerName}`);
      }
      if (layer instanceof L.TileLayer || layer instanceof L.TileLayer.WMS) {
        layer.on('loading', () => this.setMapLoadingCursor(true));  
        layer.on('load', () => this.setMapLoadingCursor(false));    
        layer.on('tileerror', () => this.setMapLoadingCursor(false));
      } else {
        this.setMapLoadingCursor(false); 
      }
      return layer;
    } catch (error) {
      this.map.getContainer().classList.remove('loading-cursor');
      throw error;
    }
  }

  private setMapLoadingCursor(isLoading: boolean): void {
    const mapContainer = this.map.getContainer();
    if (mapContainer) {
      if (isLoading) {
        mapContainer.classList.add('loading-cursor');
      } else {
        mapContainer.classList.remove('loading-cursor');
      }
    } else {
    }
  }

  checkGraphButtonVisibility() {
    const activeLayers = [
      'Textura_suelo_0', 'Textura_suelo_10', 'Textura_suelo_30',
      'Textura_suelo_60', 'Textura_suelo_100', 'Textura_suelo_200'];
    this.showSidebarButton = activeLayers.some(layer => this.activeLayers[layer]);
  }

  async getUserLocation(): Promise<void> {
    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const { latitude, longitude } = position.coords;
      this.map.setView([latitude, longitude], 15);
    } catch (error) {
    }
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

  async captureMap(): Promise<void> {
    const mapElement = document.getElementById('map-private');
    if (!mapElement) {
      return;
    }

    try {
      const width = mapElement.scrollWidth;
      const height = mapElement.scrollHeight;
      const scaleFactor = Math.max(window.devicePixelRatio || 1, 1);

      const dataUrl = await domtoimage.toPng(mapElement, {
        quality: 1,
        bgcolor: '#fff',
        style: {
          transform: `scale(${scaleFactor})`,
          'transform-origin': 'top left',
          width: `${width * scaleFactor}px`,
          height: `${height * scaleFactor}px`
        }
      });

      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `mapa_${new Date().getTime()}.png`;
      link.click();
    } catch (error) {
    }
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

        if (this.searchMarker) {
          this.map.removeLayer(this.searchMarker);
          this.searchMarker = null;
        }

        if (this.limitesMunicipalesHighlight) {
          this.limitesMunicipalesHighlight.clearLayers();
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
  
        this.showSidebarButton = false;
        this.sidebarOpen = false;
  
        if (this.pieChart) {
          this.pieChart.destroy();
          this.pieChart = null;
        }
  
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

  async consultarInformacionFeature(event: L.LeafletMouseEvent) {
    const searchContainer = document.querySelector('.map-search-container');
    if (searchContainer && searchContainer.contains(event.originalEvent.target as Node)) {
      return;
    }
  
    const latlng = event.latlng;
    
    const capasConModal = ['modgene','cuencas', 'limitesDepartamentales', 'limitesMunicipales', 'redCaminos', 'redHidrica'];
    const capaActiva = capasConModal.find(capa => this.capas[capa] && this.map.hasLayer(this.capas[capa]));
  
    this.departamentoService.obtenerInformacionDepartamento(latlng.lng, latlng.lat)
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            const departamentoInfo = data[0];
            this.mostrarModalInformacion(departamentoInfo);
            this.agregarMarcador(latlng, departamentoInfo);
          } else {
          }
        },
        error: (error) => {
        }
      });
  }



  agregarMarcador(latlng: L.LatLng, propiedades: { [key: string]: any }) {
    const capasValidas = ['modgene', 'cuencas', 'limitesDepartamentales', 'limitesMunicipales', 'redCaminos', 'redHidrica'];

    const capaActiva = capasValidas.some(capa => this.capas[capa] && this.map.hasLayer(this.capas[capa]));

    if (!capaActiva) {
      if (this.marcadorSeleccionado) {
        this.map.removeLayer(this.marcadorSeleccionado);
        this.marcadorSeleccionado = null; 
      }
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

    this.marcadorSeleccionado = L.marker(latlng, { icon: customIcon }).addTo(this.map)
  }

  mostrarModalInformacion(propiedades: any) {
    this.modalInfo = [
      { key: 'Departamento:', value: propiedades.Departamento || 'N/A' },
      { key: 'Provincia:', value: propiedades.ProvinciaPunto || 'N/A' },
      { key: 'Municipio:', value: propiedades.MunicipioPunto || 'N/A' },
      { key: 'Mercados en Departamento (Total):', value: propiedades.NumeroMercados?.toString() || 'N/A' },
      { key: 'Mercados en Municipio (Total):', value: propiedades.NumeroMercadosMunicipio?.toString() || 'N/A' },
      { key: 'Municipios en Departamento (Total):', value: propiedades.NumeroMunicipios?.toString() || 'N/A' },
      { key: 'Provincias en Departamento (Total):', value: propiedades.NumeroProvincias?.toString() || 'N/A' },
      { key: 'Sub-Cuenca:', value: propiedades.CuencaPunto || 'N/A' },
      { key: 'Ríos dentro del Municipio:', value: propiedades.RiosMunicipio || 'N/A' }
    ];

    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.modalInfo = [];
  }

  async initSearch(): Promise<void> {
    try {
      const municipios = await firstValueFrom(this.limitesmuservice.listarTodos());
      
      for (const municipio of municipios) { 
        if (municipio.geom) {
          try {
            const geojson = JSON.parse(municipio.geom);
            if (geojson.type === 'MultiPolygon') {
              const centroid = await this.metodos.calculateCentroid(geojson);
              if (centroid) {
                (municipio as any).lng = centroid[0];
                (municipio as any).lat = centroid[1];
              }
            }
          } catch (error) {
          }
        }
      }
      
      (this as any).municipiosData = municipios;
      
      this.searchControl.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap(async term => {
          this.isSearching = true;
          if (!term || term.length < 2) {
            this.filteredMunicipios = [];
            this.isSearching = false;
            return [];
          }
          return await this.filterMunicipios(term);
        })
      ).subscribe({
        next: (results) => {
          this.filteredMunicipios = results;
          this.isSearching = false;
        },
        error: (error) => {
          this.isSearching = false;
        }
      });
    } catch (error) {
    }
  }

  async filterMunicipios(term: string): Promise<LimitesMunicipales[]> {
    term = term.toLowerCase().trim();

    try {
      const municipios = (this as any).municipiosData || [];

      const filtered = municipios.filter((municipio: LimitesMunicipales) => 
        municipio.mun.toLowerCase().includes(term) ||
        (municipio.dep && municipio.dep.toLowerCase().includes(term)) ||
        (municipio.prov && municipio.prov.toLowerCase().includes(term))
      );

      return filtered;
    } catch (error) {
      return [];
    }
  }

  async selectMunicipio(municipio: LimitesMunicipales): Promise<void> {
    this.filteredMunicipios = [];
  
    try {
      let lat = (municipio as any).lat;
      let lng = (municipio as any).lng;
  
      if (!lat || !lng) {
        if (municipio.geom) {
          const geojson = JSON.parse(municipio.geom);
          const centroid = await this.metodos.calculateCentroid(geojson);
          if (centroid) {
            lng = centroid[0];
            lat = centroid[1];
          }
        }
      }
  
      await this.highlightMunicipio(municipio);
  
      if (this.searchMarker) {
        this.map.removeLayer(this.searchMarker);
        this.searchMarker = null;
      }
  
      if (lat && lng) {
        this.map.setView([lat, lng], 12);
      }
    } catch (error) {
    }
  }

  async highlightMunicipio(municipio: LimitesMunicipales): Promise<void> {
    try {
      if (!this.limitesMunicipalesHighlight) {
        this.limitesMunicipalesHighlight = L.layerGroup().addTo(this.map);
      } else {
        this.limitesMunicipalesHighlight.clearLayers();
      }
      
      const geojson = JSON.parse(municipio.geom);
      
      const highlightStyle = {
        color: '#0e0e0d',
        weight: 3,
        opacity: 1,
        fillColor: 'transparent',
        fillOpacity: 0 
      };
      
      const layer = L.geoJSON(geojson, {
        style: highlightStyle,
        onEachFeature: (feature, layer) => {
          layer.on('click', (e) => {
            this.consultarInformacionFeature(e);
          });
        }
      }).addTo(this.limitesMunicipalesHighlight);
      
      this.map.fitBounds(layer.getBounds());
    } catch (error) {
      
      const lat = (municipio as any).lat;
      const lng = (municipio as any).lng;
      
      if (lat && lng) {
        this.map.setView([lat, lng], 12);
      }
    }
  }

  clearSearch(): void {
    this.searchControl.setValue('');
    
    this.filteredMunicipios = [];
    
    if (this.limitesMunicipalesHighlight) {
      this.limitesMunicipalesHighlight.clearLayers();
    }
    
    if (this.searchMarker) {
      this.map.removeLayer(this.searchMarker);
      this.searchMarker = null;
    }
    
    this.map.setView([-16.54529, -64.7400], 6);
  }
}