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
import 'leaflet.markercluster';
import { ProveedoralevinesService } from '../../servicios/maps/proveedoralevines.service';
import { ProveedorAlevines } from '../../interfaces/proveedor-alevines';
import { ProveedoralimentosService } from '../../servicios/maps/proveedoralimentos.service';
import { ProveedorasistenciatecnicaService } from '../../servicios/maps/proveedorasistenciatecnica.service';
import { ProveedorAlimentos } from '../../interfaces/proveedor-alimentos';
import { ProveedorAsistenciaTecnica } from '../../interfaces/proveedor-asistencia-tecnica';
import proj4 from 'proj4';

@Component({
  selector: 'app-map-private',
  imports: [],
  templateUrl: './map-private.component.html',
  styleUrl: './map-private.component.css'
})
export class MapPrivateComponent implements OnInit {
  isAccordionOpen = false;
  private map!: L.Map;
  private capas: { [key: string]: L.Layer } = {};
  constructor(private cap_depservice: CapitalesDepartamentalesService,
    private cuencasService: CuencasService,
    private limitesdepservice: LimitesDepartamentalesService,
    private limitesmuservice: LimitesMunicipalesService,
    private mercadoservices: MercadosService,
    private proveedoralevinesservice: ProveedoralevinesService,
    private proveedoralimentoservice: ProveedoralimentosService,
    private proveedorasistenciatecnicaservice: ProveedorasistenciatecnicaService) { }

    toggleAccordion() {
      this.isAccordionOpen = !this.isAccordionOpen;
    }
  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    this.map = L.map('map-private').setView([-16.54529, -64.7400], 6);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18
    }).addTo(this.map);
  }
  toggleLayer(layerName: string, event: any) {
    const button = event.target.closest('.layer-btn');

    if (!this.capas[layerName]) {
        switch (layerName) {
            case 'cuencas':
                this.capas[layerName] = this.CargarCuencas();
                break;
            case 'mercados':
                this.capas[layerName] = this.Cargarmercados();
                break;
            case 'capitalesDepartamentales':
                this.capas[layerName] = this.CargarCapitalesDepartamentales();
                break;
            case 'limitesDepartamentales':
                this.capas[layerName] = this.CargarLimitesDepartamentales();
                break;
            case 'limitesMunicipales':
                this.capas[layerName] = this.CargarLimitesMunicipales();
                break;
            case 'proveedorAlevines':
                this.capas[layerName] = this.CargarProveedorAlevines();
                break;
            case 'proveedorAlimentos':
                this.capas[layerName] = this.CargarProveedorAlimentos();
                break;
            case 'proveedorAsistenciaTecnica':
                this.capas[layerName] = this.CargarProveedoresAsistenciaTecnica();
                break;
            case 'redCaminos':
                this.capas[layerName] = this.CargarRedCaminos();
                break;
            case 'redHidrica':
                this.capas[layerName] = this.CargarRedHidrica();
                break;
        }

        button.classList.add('active');
    } else {
        this.map.removeLayer(this.capas[layerName]);
        delete this.capas[layerName];

        button.classList.remove('active');
    }
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

  CargarCuencas(): L.Layer {
    const layerGroup = L.layerGroup();

    this.cuencasService.listarTodos().subscribe((cuencas: Cuencas[]) => {
      cuencas.forEach(cuenca => {
        if (cuenca.geom) {
          const geojson = JSON.parse(cuenca.geom);

          if (geojson.type === 'MultiPolygon') {
            const estiloPoligono = {
              color: '#2196F3',
              weight: 2,
              opacity: 1,
              fillColor: '#64B5F6',
              fillOpacity: 0.5
            };

            const polygon = L.geoJSON(geojson, {
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
                    const layer = e.target;
                    layer.setStyle({
                      weight: 3,
                      fillOpacity: 0.7
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

  CargarLimitesDepartamentales(): L.Layer {
    const layerGroup = L.layerGroup();

    this.limitesdepservice.listarTodos().subscribe((lim_deps: LimitesDepartamentales[]) => {
      lim_deps.forEach(lim_dep => {
        if (lim_dep.geom) {
          const geojson = JSON.parse(lim_dep.geom);

          if (geojson.type === 'MultiPolygon') {
            const estiloPoligono = {
              color: '#2196F3',
              weight: 2,
              opacity: 1,
              fillColor: '#64B5F6',
              fillOpacity: 0.5
            };

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
                      fillOpacity: 0.7
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

    this.limitesmuservice.listarTodos().subscribe((lim_muns: LimitesMunicipales[]) => {
      lim_muns.forEach(lim_mun => {
        if (lim_mun.geom) {
          const geojson = JSON.parse(lim_mun.geom);

          if (geojson.type === 'MultiPolygon') {
            const estiloPoligono = {
              color: '#2196F3',
              weight: 2,
              opacity: 1,
              fillColor: '#64B5F6',
              fillOpacity: 0.5
            };

            const polygon = L.geoJSON(geojson, {
              style: estiloPoligono,
              onEachFeature: (feature, layer) => {
                layer.bindPopup(`
                              <div class="popup-content">
                                  <h4>${lim_mun.dep}</h4>
                                  <h4>${lim_mun.prov}</h4>
                                  <h4>${lim_mun.mun}</h4>
                              </div>
                          `);

                layer.on({
                  mouseover: (e) => {
                    const layer = e.target;
                    layer.setStyle({
                      weight: 3,
                      fillOpacity: 0.7
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
              .bindPopup(`<strong>${mercado.nombre}</strong><br>${mercado.provincia}`);

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

    this.proveedorasistenciatecnicaservice.listarTodos().subscribe(proveedores => {
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
    const redCaminos = L.tileLayer.wms("http://localhost:8085/geoserver/capas_geo/wms", {
      layers: 'capas_geo:red_caminos',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8
    });

    this.map.addLayer(redCaminos);
    return redCaminos;
  }

  CargarRedHidrica(): L.Layer {
    const redHidrica = L.tileLayer.wms("http://localhost:8085/geoserver/capas_geo/wms", {
      layers: 'capas_geo:red_hidrica',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8
    });

    this.map.addLayer(redHidrica);
    return redHidrica;
  }

}