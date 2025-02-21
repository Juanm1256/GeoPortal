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
import { firstValueFrom, Observable, Subscription } from 'rxjs';
import { TexturasService } from '../../servicios/maps/texturas.service';
import { Texturas } from '../../interfaces/texturas';
import { DepartamentoinfoService } from '../../servicios/maps/departamentoinfo.service';
import { DepartamentoInforDTO } from '../../interfaces/departamento-infor-dto';

@Component({
  selector: 'app-map-private',
  imports: [CommonModule],
  templateUrl: './map-private.component.html',
  styleUrl: './map-private.component.css'
})
export class MapPrivateComponent implements OnInit, OnDestroy {
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
      this.checkGraphButtonVisibility();
      this.makeModalDraggable();
      this.themeSubscription = this.themeService.isDarkMode$.subscribe((isDark) => {
        this.isDarkMode = isDark;
      });
    } catch (error) {
      //console.error('Error en la inicialización:', error);
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
  // ✅ Deshabilita las interacciones del mapa
  public disableMapInteractions(): void {
    if (this.map) {
      this.map.dragging.disable(); // Deshabilita el arrastre
      this.map.scrollWheelZoom.disable(); // Deshabilita el zoom con la rueda del mouse
      this.map.doubleClickZoom.disable(); // Deshabilita el zoom por doble clic
      this.map.boxZoom.disable(); // Deshabilita el zoom con caja
      this.map.keyboard.disable(); // Deshabilita el control con teclado
      this.map.off('click'); // Deshabilita los eventos de clic
    }
  }

  // ✅ Habilita las interacciones del mapa
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
        dragging: true,   // Arrastre habilitado solo dentro del mapa
        boxZoom: true,    // Zoom de caja habilitado
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
      //console.error('Error al inicializar el mapa:', error);
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
        //console.error('Error al cambiar la capa base:', error);
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
                //console.error('Error al obtener información de la característica:', error);
              }
            }
          });
        } catch (error) {
          //console.error('Error al obtener información de la característica:', error);
        }
      }
    });
  }

  toggleSidebar() {
    //console.log("🔹 toggleSidebar() llamado");
    //console.log("🔹 showSidebarButton:", this.showSidebarButton);


    if (this.showSidebarButton) {
      this.sidebarOpen = !this.sidebarOpen;
      //console.log("🔹 sidebarOpen:", this.sidebarOpen);

      if (this.sidebarOpen) {
        this.openSidebarWithLayerData('Textura del Suelo');
        setTimeout(() => this.showPieChart(), 300);
      } else {
        if (this.pieChart) {
          this.pieChart.destroy();
        }
      }
    } else {
      //console.warn("⚠️ showSidebarButton es falso. El panel no se mostrará.");
    }
  }
  isAnyLayerActive(): boolean {
    const activeLayers = [
      'Textura_suelo_0', 'Textura_suelo_10',
      'Textura_suelo_30', 'Textura_suelo_60', 'Textura_suelo_100', 'Textura_suelo_200'
    ];
    //console.log("🔹 isAnyLayerActive():", activeLayers.some(layer => this.activeLayers[layer]));
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
            label: `Valor ${item.Value}`,
            value: item.Porcentaje,
            color: colorMap[item.Value] || '#cccccc'
          }));
          await this.showPieChart();
        }
      }
    } catch (error) {
      //console.error('Error al abrir el panel lateral:', error);
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
      //console.error('Error al mostrar el gráfico:', error);
    }
  }


  toggleAccordion() {
    this.isAccordionOpen = !this.isAccordionOpen;
  }

  toggleLayers() {
    this.isLayersOpen = !this.isLayersOpen;
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

        // 🔹 Si la capa es 'modgene' o si no hay capas activas, eliminar el marcador
        if (layerName === 'modgene' && this.marcadorSeleccionado) {
          this.map.removeLayer(this.marcadorSeleccionado);
          this.marcadorSeleccionado = null;
        }

        // 🔹 Comprobar si no hay capas activas de la lista específica y eliminar el marcador
        const capasValidas = ['modgene', 'cuencas', 'limitesDepartamentales', 'limitesMunicipales', 'redCaminos', 'redHidrica'];
        const capaActiva = capasValidas.some(capa => this.capas[capa] && this.map.hasLayer(this.capas[capa]));

        if (!capaActiva && this.marcadorSeleccionado) {
          this.map.removeLayer(this.marcadorSeleccionado);
          this.marcadorSeleccionado = null;
        }
      }

      this.checkGraphButtonVisibility();
    } catch (error) {
      //console.error(`Error al alternar la capa ${layerName}:`, error);
    }
  }


  private async loadLayer(layerName: string): Promise<L.Layer | L.LayerGroup> {
    try {
      let layer: L.Layer | L.LayerGroup;

      // 🔄 Cursor spinner antes de iniciar la carga
      this.map.getContainer().classList.add('loading-cursor');

      switch (layerName) {
        case 'cuencas':
          layer = await this.metodos.CargarCuencas(this.map, this.cuencasService);
          break;
        case 'mercados':
          layer = await this.metodos.Cargarmercados(this.map, this.mercadoservices);
          break;
        case 'capitalesDepartamentales':
          layer = await this.metodos.CargarCapitalesDepartamentales(this.map, this.cap_depservice);
          break;
        case 'limitesDepartamentales':
          layer = await this.metodos.CargarLimitesDepartamentales(this.map, this.limitesdepservice);
          break;
        case 'limitesMunicipales':
          layer = await this.metodos.CargarLimitesMunicipales(this.map, this.limitesmuservice);
          break;
        case 'proveedorAlevines':
          layer = await this.metodos.CargarProveedorAlevines(this.map, this.proveedoralevinesservice);
          break;
        case 'proveedorAlimentos':
          layer = await this.metodos.CargarProveedorAlimentos(this.map, this.proveedoralimentoservice);
          break;
        case 'proveedorAsistenciaTecnica':
          layer = await this.metodos.CargarProveedoresAsistenciaTecnica(this.map, this.proveedorasistenciatecnicaservice);
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
        default:
          throw new Error(`Capa no reconocida: ${layerName}`);
      }

      if (!layer) {
        throw new Error(`No se pudo cargar la capa: ${layerName}`);
      }

      // ✅ Detectar eventos de carga de la capa
      if (layer instanceof L.TileLayer || layer instanceof L.TileLayer.WMS) {
        layer.on('loading', () => this.map.getContainer().classList.add('loading-cursor'));
        layer.on('load', () => this.map.getContainer().classList.remove('loading-cursor'));
        layer.on('tileerror', () => this.map.getContainer().classList.remove('loading-cursor'));
      }

      return layer;
    } catch (error) {
      // ❌ En caso de error, quitar el cursor spinner
      this.map.getContainer().classList.remove('loading-cursor');
      throw error;
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
      //console.error('Error al obtener la ubicación del usuario:', error);
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

  async captureMap(): Promise<void> {
    const mapElement = document.getElementById('map-private');
    if (!mapElement) {
      //console.error("No se encontró el mapa");
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
      //console.error('Error al capturar el mapa:', error);
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

  async consultarInformacionFeature(event: L.LeafletMouseEvent) {
    const latlng = event.latlng;

    // Obtener la capa activa que debe mostrar el modal
    const capasConModal = ['modgene','cuencas', 'limitesDepartamentales', 'limitesMunicipales', 'redCaminos', 'redHidrica'];
    const capaActiva = capasConModal.find(capa => this.capas[capa] && this.map.hasLayer(this.capas[capa]));

    if (!capaActiva) {
      console.warn("⚠️ No hay una capa activa con funcionalidad de modal.");
      return;
    }
    this.departamentoService.obtenerInformacionDepartamento(latlng.lng, latlng.lat)
      .subscribe({
        next: (data) => {
          if (data && data.length > 0) {
            const departamentoInfo = data[0];
            this.mostrarModalInformacion(departamentoInfo, capaActiva);
            this.agregarMarcador(latlng, departamentoInfo);
          } else {
            //console.log('⚠️ No se encontró información en esta ubicación');
          }
        },
        error: (error) => {
          //console.error('❌ Error al consultar información:', error);
        }
      });
  }



  agregarMarcador(latlng: L.LatLng, propiedades: { [key: string]: any }) {
    const capasValidas = ['modgene', 'cuencas', 'limitesDepartamentales', 'limitesMunicipales', 'redCaminos', 'redHidrica'];

    // 🔹 Verificar si alguna de las capas válidas está activa
    const capaActiva = capasValidas.some(capa => this.capas[capa] && this.map.hasLayer(this.capas[capa]));

    // 🔹 Si no hay capas activas, eliminar el marcador y salir
    if (!capaActiva) {
      if (this.marcadorSeleccionado) {
        this.map.removeLayer(this.marcadorSeleccionado);
        this.marcadorSeleccionado = null; // Limpiar referencia
      }
      return;
    }

    // 🔹 Icono personalizado
    const customIcon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon-red.png',
      iconSize: [32, 40],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });

    // 🔹 Eliminar marcador anterior si existe
    if (this.marcadorSeleccionado) {
      this.map.removeLayer(this.marcadorSeleccionado);
    }

    // 🔹 Crear y agregar el marcador rojo con popup
    this.marcadorSeleccionado = L.marker(latlng, { icon: customIcon })

      .addTo(this.map)

  }



  mostrarModalInformacion(propiedades: any, capa: string) {
    this.modalInfo = [
      { key: 'Cuenca', value: propiedades.CuencaPunto || 'N/A' },
      { key: 'Departamento', value: propiedades.Departamento || 'N/A' },
      { key: 'Municipio', value: propiedades.MunicipioPunto || 'N/A' },
      { key: 'Número de Mercados', value: propiedades.NumeroMercados?.toString() || 'N/A' },
      { key: 'Número de Municipios', value: propiedades.NumeroMunicipios?.toString() || 'N/A' },
      { key: 'Número de Provincias', value: propiedades.NumeroProvincias?.toString() || 'N/A' },
      { key: 'Provincia', value: propiedades.ProvinciaPunto || 'N/A' }
    ];

    this.showModal = true;
  }

  cerrarModal() {
    this.showModal = false;
    this.modalInfo = [];
  }
}