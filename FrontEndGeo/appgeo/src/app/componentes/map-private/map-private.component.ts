import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import { CapitalesDepartamentalesService } from '../../servicios/maps/capitales-departamentales.service';
import { CapitalesDepartamentales } from '../../interfaces/capitales-departamentales';
import { CuencasService } from '../../servicios/maps/cuencas.service';
import { Cuencas } from '../../interfaces/cuencas';
import { LimitesDepartamentalesService } from '../../servicios/maps/limites-departamentales.service';
import { LimitesDepartamentales } from '../../interfaces/limites-departamentales';
import { LimitesMunicipalesService } from '../../servicios/maps/limites-municipales.service';
import { LimitesMunicipales } from '../../interfaces/limites-municipales';
import { MercadosService } from '../../servicios/maps/mercados.service';
import { Mercados } from '../../interfaces/mercados';
import { ProveedoralevinesService } from '../../servicios/maps/proveedoralevines.service';
import { ProveedorAlevines } from '../../interfaces/proveedor-alevines';
import { ProveedoralimentosService } from '../../servicios/maps/proveedoralimentos.service';
import { ProveedorasistenciatecnicaService } from '../../servicios/maps/proveedorasistenciatecnica.service';
import { ProveedorAlimentos } from '../../interfaces/proveedor-alimentos';
import { ProveedorAsistenciaTecnica } from '../../interfaces/proveedor-asistencia-tecnica';
import { CommonModule } from '@angular/common';
import 'leaflet.markercluster';
import { map, filter, mergeMap, bufferCount, delay, take } from 'rxjs/operators';
import { from } from 'rxjs';
import Swal from 'sweetalert2';
import { ColoresMapaUtil } from '../../Colores/Colores';
// @ts-ignore
import domtoimage from 'dom-to-image';

@Component({

  selector: 'app-map-private',
  imports: [CommonModule],
  templateUrl: './map-private.component.html',
  styleUrl: './map-private.component.css'
})
export class MapPrivateComponent implements OnInit {
  private map!: L.Map;
  private markerLayer = L.layerGroup();
  private markers: L.Marker[] = [];
  private capas: { [key: string]: L.Layer } = {};
  activeLayers: { [key: string]: boolean } = {};

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
  ) {}

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
        case 'cuencas': this.capas[layerName] = this.CargarCuencas(); break;
        case 'mercados': this.capas[layerName] = this.Cargarmercados(); break;
        case 'capitalesDepartamentales': this.capas[layerName] = this.CargarCapitalesDepartamentales(); break;
        case 'limitesDepartamentales': this.capas[layerName] = this.CargarLimitesDepartamentales(); break;
        case 'limitesMunicipales': this.capas[layerName] = this.CargarLimitesMunicipales(); break;
        case 'proveedorAlevines': this.capas[layerName] = this.CargarProveedorAlevines(); break;
        case 'proveedorAlimentos': this.capas[layerName] = this.CargarProveedorAlimentos(); break;
        case 'proveedorAsistenciaTecnica': this.capas[layerName] = this.CargarProveedoresAsistenciaTecnica(); break;
        case 'redCaminos': this.capas[layerName] = this.CargarRedCaminos();break;
        case 'redHidrica': this.capas[layerName] = this.CargarRedHidrica();break;
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

  /*** FUNCIONES DE MAPA ***/
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

    domtoimage.toPng(mapElement, {
        quality: 1,
        bgcolor: '#fff',
        style: {
            transform: 'scale(1)',
            'transform-origin': 'top left'
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


  CargarCapitalesDepartamentales(): L.Layer {
    const layerGroup = L.layerGroup();

    this.cap_depservice.listarTodos().subscribe((cap_dep: CapitalesDepartamentales[]) => {
      cap_dep.forEach(cap_deps => {
        if (cap_deps.geom) {
          const geojson = JSON.parse(cap_deps.geom);

          if (geojson.type === 'Point') {
            const [lon, lat] = geojson.coordinates;

            const icono = L.icon({
              iconUrl: '../assets/leaflet/marker-icon-2x.png',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            });

            const marker = L.marker([lat, lon], { icon: icono })
              .bindPopup(`<strong>${cap_deps.cap_dep}</strong><br><strong>${cap_deps.cod_ine}</strong>`);

            layerGroup.addLayer(marker);
          }
        }
      });
    });

    this.map.addLayer(layerGroup);
    return layerGroup;
  }

  CargarCuencas(): L.LayerGroup {
    const layerGroup = L.layerGroup();
  
    this.cuencasService.listarTodos().pipe(
      mergeMap((cuencas: Cuencas[]) => from(cuencas)),
      filter(cuenca => cuenca.geom && 
        JSON.parse(cuenca.geom).type === 'MultiPolygon'),
      map(cuenca => {
        const geojson = JSON.parse(cuenca.geom);
        const estiloPoligono = {
          color: '#2196F3',
          weight: 2,
          opacity: 1,
          fillColor: '#64B5F6',
          fillOpacity: 0
        };
  
        const colorMouseOver = ColoresMapaUtil.obtenerColorAleatorio();
  
        return L.geoJSON(geojson, {
          style: estiloPoligono,
          onEachFeature: (feature, layer) => {
            layer.bindPopup(`
              <div class="popup-content">
                <h4>${cuenca.cuenca}</h4>
                <p>Superficie: ${cuenca.sup_km2} km²</p>
              </div>
            `);
  
            layer.on({
              mouseover: (e) => {
                const targetLayer = e.target;
                targetLayer.setStyle({
                  weight: 3,
                  fillOpacity: 0.7,
                  color: colorMouseOver,
                  fillColor: ColoresMapaUtil.ajustarOpacidadColor(colorMouseOver, 1)
                });
              },
              mouseout: (e) => {
                const targetLayer = e.target;
                targetLayer.setStyle(estiloPoligono);
              }
            });
  
            return layer;
          }
        });
      }),
      bufferCount(10),
      delay(100)
    ).subscribe(layers => {
      layers.forEach(layer => layerGroup.addLayer(layer));
      this.map.addLayer(layerGroup);
    });
  
    return layerGroup;
  }

  CargarLimitesDepartamentales(): L.Layer {
    const layerGroup = L.layerGroup();

    this.limitesdepservice.listarTodos().subscribe((lim_deps: LimitesDepartamentales[]) => {
      lim_deps.forEach(lim_dep => {
        if (lim_dep.geom) {
          const geojson = JSON.parse(lim_dep.geom);

          if (geojson.type === 'MultiPolygon') {
            const estiloPoligono = {
              color: '#191b1c',
              weight: 2,
              opacity: 1,
              fillColor: '#64B5F6',
              fillOpacity: 0
            };

            const colorMouseOver = ColoresMapaUtil.obtenerColorAleatorio(ColoresMapaUtil.PALETA_PASTEL);

            const polygon = L.geoJSON(geojson, {
              style: estiloPoligono,
              onEachFeature: (feature, layer) => {
                layer.bindPopup(`
                              <div class="popup-content">
                                  <h4>${lim_dep.dep}</h4>
                                  <p>Superficie: ${lim_dep.cod_dep} km²</p>
                              </div>
                          `);

                layer.on({
                  mouseover: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                      weight: 3,
                      fillOpacity: 0.7,
                      color: colorMouseOver,
                      fillColor: ColoresMapaUtil.ajustarOpacidadColor(colorMouseOver, 1)
                    });
                  },
                  mouseout: (e) => {
                    const layer = e.target;
                    layer.setStyle(estiloPoligono);
                  }
                });
              }
            });

            layerGroup.addLayer(polygon);
          }
        }
      });
    });

    this.map.addLayer(layerGroup);
    return layerGroup;
  }

  CargarLimitesMunicipales(): L.Layer {
    const layerGroup = L.layerGroup();
  
    this.limitesmuservice.listarTodos().pipe(
      mergeMap((lim_muns: LimitesMunicipales[]) => from(lim_muns)),
      filter(lim_mun => lim_mun.geom && 
        JSON.parse(lim_mun.geom).type === 'MultiPolygon'),
      map(lim_mun => {
        const geojson = JSON.parse(lim_mun.geom);
        const estiloPoligono = {
          color: '#191b1c',
          weight: 2,
          opacity: 1,
          fillColor: '#64B5F6',
          fillOpacity: 0
        };
  
        const colorMouseOver = ColoresMapaUtil.obtenerColorAleatorio(ColoresMapaUtil.PALETA_PASTEL);
  
        return L.geoJSON(geojson, {
          style: estiloPoligono,
          onEachFeature: (feature, layer) => {
            layer.bindPopup(`
              <div class="popup-content">
                <p>Departamento: ${lim_mun.dep}</p>
                <p>Provincia: ${lim_mun.prov}</p>
                <p>Municipio: ${lim_mun.mun}</p>
              </div>
            `);
  
            layer.on({
              mouseup: (e) => {
                const targetLayer = e.target;
                targetLayer.setStyle({
                  weight: 3,
                  fillOpacity: 0.7,
                  color: colorMouseOver,
                  fillColor: ColoresMapaUtil.ajustarOpacidadColor(colorMouseOver, 1)
                });
              }
            });
  
            return layer;
          }
        });
      }),
      bufferCount(10),
      delay(100)
    ).subscribe(layers => {
      layers.forEach(layer => layerGroup.addLayer(layer));
      this.map.addLayer(layerGroup);
    });
  
    return layerGroup;
  }

  Cargarmercados(): L.Layer {
    const markerCluster = L.markerClusterGroup();

    this.mercadoservices.listarTodos().subscribe((mercados: Mercados[]) => {
      mercados.forEach(mercado => {
        if (mercado.geom) {
          const geojson = JSON.parse(mercado.geom);
          if (geojson.type === 'Point') {
            const [lon, lat] = geojson.coordinates;
            const icono = L.icon({
              iconUrl: '../assets/leaflet/marker-icon-2x.png',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            });

            const marker = L.marker([lat, lon], { icon: icono })
              .bindPopup(`<div class="popup-content">
                <p>${mercado.nombre}</p>
                <p>Provincia: ${mercado.provincia}</p>
                <p>Municipio: ${mercado.municipio}</p>
            </div>`);

            markerCluster.addLayer(marker);
          }
        }
      });

      this.map.addLayer(markerCluster);
    });

    return markerCluster;
  }

  CargarProveedorAlevines(): L.Layer {
    const layerGroup = L.layerGroup();

    this.proveedoralevinesservice.listarTodos().subscribe((proveedores: ProveedorAlevines[]) => {
      proveedores.forEach(proveedor => {
        if (proveedor.geom) {
          const geojson = JSON.parse(proveedor.geom);
          if (geojson.type === 'Point') {
            const [lon, lat] = geojson.coordinates;

            const icono = L.icon({
              iconUrl: '../assets/leaflet/marker-icon-2x.png',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            });

            const marker = L.marker([lat, lon], { icon: icono })
              .bindPopup(`<strong>${proveedor.name}</strong>`);

            layerGroup.addLayer(marker);
          }
        }
      });

      this.map.addLayer(layerGroup);
    });

    return layerGroup;
  }

  CargarProveedorAlimentos(): L.Layer {
    const layerGroup = L.layerGroup();

    this.proveedoralimentoservice.listarTodos().subscribe((datos: ProveedorAlimentos[]) => {
      datos.forEach(dato => {
        if (dato.geom) {
          const geojson = JSON.parse(dato.geom);
          if (geojson.type === 'Point') {
            const [lon, lat] = geojson.coordinates;

            const icono = L.icon({
              iconUrl: '../assets/leaflet/marker-icon-2x.png',
              iconSize: [32, 32],
              iconAnchor: [16, 32],
              popupAnchor: [0, -32]
            });

            const marker = L.marker([lat, lon], { icon: icono })
              .bindPopup(`<strong>${dato.name}</strong>`);

            layerGroup.addLayer(marker);
          }
        }
      });

      this.map.addLayer(layerGroup);
    });

    return layerGroup;
  }

  CargarProveedoresAsistenciaTecnica(): L.Layer {
    const layerGroup = L.layerGroup();

    this.proveedorasistenciatecnicaservice.listarTodos().subscribe((proveedores: ProveedorAsistenciaTecnica[]) => {
      proveedores.forEach(proveedor => {
        if (proveedor.geom) {
          try {
            const geojson = JSON.parse(proveedor.geom);

            if (geojson.type === 'Point') {
              const lat = geojson.coordinates[1];
              const lon = geojson.coordinates[0];

              const icono = L.icon({
                iconUrl: '../assets/leaflet/marker-icon-2x.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34]
              });

              const marker = L.marker([lat, lon], { icon: icono })
                .bindPopup(`
                              <div class="popup-content">
                                  <h3>${proveedor.name || 'Sin nombre'}</h3>
                                  <p><strong>ID:</strong> ${proveedor.gid}</p>
                                  <p><strong>Coordenadas:</strong></p>
                                  <p>Lat: ${lat.toFixed(6)}</p>
                                  <p>Lon: ${lon.toFixed(6)}</p>
                              </div>
                          `);

              layerGroup.addLayer(marker);
            }
          } catch (error) {
            console.error(`Error procesando proveedor ${proveedor.gid}:`, error);
          }
        }
      });

      this.map.addLayer(layerGroup);
    });

    return layerGroup;
  }

  CargarRedCaminos(): L.Layer {
    const redCaminos = L.tileLayer.wms("http://localhost:8085/geoserver/capas_geo/wms?", {
      layers: 'capas_geo:red_caminos',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    this.map.addLayer(redCaminos);
    return redCaminos;
  }

  CargarRedHidrica(): L.Layer {
    const redHidrica = L.tileLayer.wms("http://localhost:8085/geoserver/capas_geo/wms?", {
      layers: 'capas_geo:red_hidrica',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    this.map.addLayer(redHidrica);
    return redHidrica;
  }

}