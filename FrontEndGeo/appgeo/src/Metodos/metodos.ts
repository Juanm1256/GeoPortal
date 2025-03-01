import * as L from 'leaflet';
import 'leaflet.markercluster';
import { from } from 'rxjs';
import { map, filter, mergeMap, bufferCount, delay } from 'rxjs/operators';
// Importar interfaces
import { CapitalesDepartamentales } from '../app/interfaces/capitales-departamentales';
import { Cuencas } from '../app/interfaces/cuencas';
import { Mercados } from '../app/interfaces/mercados';
import { LimitesDepartamentales } from '../app/interfaces/limites-departamentales';
import { LimitesMunicipales } from '../app/interfaces/limites-municipales';
import { ProveedorAlevines } from '../app/interfaces/proveedor-alevines';
import { ProveedorAlimentos } from '../app/interfaces/proveedor-alimentos';
import { ProveedorAsistenciaTecnica } from '../app/interfaces/proveedor-asistencia-tecnica';
// Importar utilidades
import { ColoresMapaUtil } from '../app/Colores/Colores';

export class Metodos {


  async CargarCuencas(
    maping: L.Map,
    cuencasService: any,
    setMapLoadingCursor?: (isLoading: boolean) => void 
  ): Promise<L.Layer> {
    const layerGroup = L.layerGroup();
    let poligonoSeleccionado: L.Path | null = null;

    if (setMapLoadingCursor) setMapLoadingCursor(true); 

    return new Promise<L.Layer>((resolve, reject) => {
      cuencasService.listarTodos().subscribe({
        next: (cuencas: Cuencas[]) => {
          cuencas.forEach(cuenca => {
            if (cuenca.geom) {
              const geojson = JSON.parse(cuenca.geom);
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
                    layer.on({
                      mouseup: (e) => {
                        const layer = e.target as L.Path;

                        
                        if (poligonoSeleccionado && poligonoSeleccionado !== layer) {
                          poligonoSeleccionado.setStyle(estiloPoligono);
                        }

                        
                        layer.setStyle({
                          weight: 3,
                          fillOpacity: 0.2,
                          color: colorMouseOver,
                          fillColor: ColoresMapaUtil.ajustarOpacidadColor(colorMouseOver, 1)
                        });

                        poligonoSeleccionado = layer;
                      }
                    });
                  }
                });

                layerGroup.addLayer(polygon);
              }
            }
          });

          maping.addLayer(layerGroup);
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          resolve(layerGroup);
        },
        error: (err: Error) => {
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          reject(err);
        }
      });
    });
  }
  async Cargarmercados(
    maping: L.Map,
    mercadoservices: any,
    setMapLoadingCursor?: (isLoading: boolean) => void 
  ): Promise<L.Layer> {
    const markerCluster = L.markerClusterGroup();

    if (setMapLoadingCursor) setMapLoadingCursor(true); 

    return new Promise<L.Layer>((resolve, reject) => {
      mercadoservices.listarTodos().subscribe({
        next: (mercados: Mercados[]) => {
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
                  .bindPopup(`
                                  <div class="popup-content">
                                      <p>${mercado.nombre}</p>
                                      <p>Provincia: ${mercado.provincia}</p>
                                      <p>Municipio: ${mercado.municipio}</p>
                                  </div>`);

                markerCluster.addLayer(marker);
              }
            }
          });

          maping.addLayer(markerCluster);
          if (setMapLoadingCursor) setMapLoadingCursor(false);
          resolve(markerCluster);
        },
        error: (err: Error) => {
          if (setMapLoadingCursor) setMapLoadingCursor(false);
          reject(err);
        }
      });
    });
  }

  async CargarCapitalesDepartamentales(
    map: L.Map,
    capitalesDepartamentalesService: any,
    setMapLoadingCursor?: (isLoading: boolean) => void 
  ): Promise<L.Layer> {
    const layerGroup = L.layerGroup();
    if (setMapLoadingCursor) setMapLoadingCursor(true);

    return new Promise<L.Layer>((resolve, reject) => {
      capitalesDepartamentalesService.listarTodos().subscribe({
        next: (cap_dep: CapitalesDepartamentales[]) => {
          cap_dep.forEach((cap_deps: CapitalesDepartamentales) => {
            if (cap_deps.geom) {
              try {
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
                    .bindPopup(`
                                        <div class="popup-content">
                                            <strong>${cap_deps.cap_dep}</strong>
                                            <br>
                                            <strong>Código INE: ${cap_deps.cod_ine}</strong>
                                        </div>
                                    `);

                  layerGroup.addLayer(marker);
                }
              } catch (error) {
                console.error('Error parsing geom:', error);
              }
            }
          });

          map.addLayer(layerGroup);
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          resolve(layerGroup);
        },
        error: (err: Error) => {
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          reject(err);
        }
      });
    });
  }
  async CargarLimitesDepartamentales(
    maping: L.Map,
    limitesdepservice: any,
    setMapLoadingCursor?: (isLoading: boolean) => void 
  ): Promise<L.Layer> {
    const layerGroup = L.layerGroup();
    let poligonoSeleccionado: L.Path | null = null;

    if (setMapLoadingCursor) setMapLoadingCursor(true); 

    return new Promise<L.Layer>((resolve, reject) => {
      limitesdepservice.listarTodos().subscribe({
        next: (lim_deps: LimitesDepartamentales[]) => {
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
                    layer.on({
                      mouseup: (e) => {
                        const layer = e.target as L.Path;

                        
                        if (poligonoSeleccionado && poligonoSeleccionado !== layer) {
                          poligonoSeleccionado.setStyle(estiloPoligono);
                        }

                        
                        layer.setStyle({
                          weight: 3,
                          fillOpacity: 0.2,
                          color: colorMouseOver,
                          fillColor: ColoresMapaUtil.ajustarOpacidadColor(colorMouseOver, 1)
                        });

                        poligonoSeleccionado = layer;
                      }
                    });
                  }
                });

                layerGroup.addLayer(polygon);
              }
            }
          });

          maping.addLayer(layerGroup);
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          resolve(layerGroup);
        },
        error: (err: Error) => {
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          reject(err);
        }
      });
    });
  }
  async CargarLimitesMunicipales(
    maping: L.Map,
    limitesmuservice: any,
    setMapLoadingCursor?: (isLoading: boolean) => void 
  ): Promise<L.Layer> {
    const layerGroup = L.layerGroup();
    let poligonoSeleccionado: L.Path | null = null;

    if (setMapLoadingCursor) setMapLoadingCursor(true); 

    return new Promise<L.Layer>((resolve, reject) => {
      limitesmuservice.listarTodos().subscribe({
        next: (lim_muns: LimitesMunicipales[]) => {
          lim_muns.forEach(lim_mun => {
            if (lim_mun.geom) {
              const geojson = JSON.parse(lim_mun.geom);

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
                    layer.on({
                      mouseup: (e) => {
                        const layer = e.target as L.Path;

                        
                        if (poligonoSeleccionado && poligonoSeleccionado !== layer) {
                          poligonoSeleccionado.setStyle(estiloPoligono);
                        }

                        
                        layer.setStyle({
                          weight: 3,
                          fillOpacity: 0.2,
                          color: colorMouseOver,
                          fillColor: ColoresMapaUtil.ajustarOpacidadColor(colorMouseOver, 1)
                        });

                        poligonoSeleccionado = layer;
                      }
                    });
                  }
                });

                layerGroup.addLayer(polygon);
              }
            }
          });

          maping.addLayer(layerGroup);
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          resolve(layerGroup);
        },
        error: (err: Error) => {
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          reject(err);
        }
      });
    });
  }
  async CargarProveedorAlevines(
    maping: L.Map,
    proveedoralevinesservice: any,
    setMapLoadingCursor?: (isLoading: boolean) => void 
  ): Promise<L.Layer> {
    const layerGroup = L.layerGroup();

    if (setMapLoadingCursor) setMapLoadingCursor(true); 

    return new Promise<L.Layer>((resolve, reject) => {
      proveedoralevinesservice.listarTodos().subscribe({
        next: (proveedores: ProveedorAlevines[]) => {
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

          maping.addLayer(layerGroup);
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          resolve(layerGroup);
        },
        error: (err: Error) => {
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          reject(err);
        }
      });
    });
  }
  async CargarProveedorAlimentos(
    maping: L.Map,
    proveedoralimentoservice: any,
    setMapLoadingCursor?: (isLoading: boolean) => void 
  ): Promise<L.Layer> {
    const layerGroup = L.layerGroup();

    if (setMapLoadingCursor) setMapLoadingCursor(true); 

    return new Promise<L.Layer>((resolve, reject) => {
      proveedoralimentoservice.listarTodos().subscribe({
        next: (datos: ProveedorAlimentos[]) => {
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

          maping.addLayer(layerGroup);
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          resolve(layerGroup);
        },
        error: (err: Error) => {
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          reject(err);
        }
      });
    });
  }

  async CargarProveedoresAsistenciaTecnica(
    maping: L.Map,
    proveedorasistenciatecnicaservice: any,
    setMapLoadingCursor?: (isLoading: boolean) => void 
  ): Promise<L.Layer> {
    const layerGroup = L.layerGroup();

    if (setMapLoadingCursor) setMapLoadingCursor(true); 

    return new Promise<L.Layer>((resolve, reject) => {
      proveedorasistenciatecnicaservice.listarTodos().subscribe({
        next: (proveedores: ProveedorAsistenciaTecnica[]) => {
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

          maping.addLayer(layerGroup);
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          resolve(layerGroup);
        },
        error: (err: Error) => {
          if (setMapLoadingCursor) setMapLoadingCursor(false); 
          reject(err);
        }
      });
    });
  }

  async CargarRedCaminos(maping: L.Map): Promise<L.Layer> {
    const redCaminos = L.tileLayer.wms("http://localhost:8085/geoserver/capas_geo/wms?", {
      layers: 'capas_geo:red_caminos',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(redCaminos);
    return redCaminos;
  }

  async CargarRedHidrica(maping: L.Map): Promise<L.Layer> {
    const redHidrica = L.tileLayer.wms("http://localhost:8085/geoserver/capas_geo/wms", {
      layers: 'capas_geo:red_hidrica',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(redHidrica);
    return redHidrica;
  }

  async cargarmodgene(maping: L.Map): Promise<L.Layer> {
    const modgene = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:Mod_general_ajustado',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(modgene);
    return modgene;
  }

  async cargarfragmentosgruesossuelo(maping: L.Map): Promise<L.Layer> {
    const Fragmentos_gruesos_suelo = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:Fragmentos_gruesos_suelo',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(Fragmentos_gruesos_suelo);
    return Fragmentos_gruesos_suelo;
  }
  async cargarph_suelo(maping: L.Map): Promise<L.Layer> {
    const pH_suelo = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:pH_suelo',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(pH_suelo);
    return pH_suelo;
  }

  async cargarTexturasuelo0(maping: L.Map): Promise<L.Layer> {
    const Texturasuelo0 = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:Textura_suelo_0',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(Texturasuelo0);
    return Texturasuelo0;
  }

  async cargarTexturasuelo10(maping: L.Map): Promise<L.Layer> {
    const Texturasuelo10 = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:Textura_suelo_10',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(Texturasuelo10);
    return Texturasuelo10;
  }
  async cargarTexturasuelo30(maping: L.Map): Promise<L.Layer> {
    const Texturasuelo30 = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:Textura_suelo_30',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(Texturasuelo30);
    return Texturasuelo30;
  }
  async cargarTexturasuelo60(maping: L.Map): Promise<L.Layer> {
    const Texturasuelo60 = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:Textura_suelo_60',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(Texturasuelo60);
    return Texturasuelo60;
  }
  async cargarTexturasuelo100(maping: L.Map): Promise<L.Layer> {
    const Texturasuelo100 = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:Textura_suelo_100',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(Texturasuelo100);
    return Texturasuelo100;
  }
  async cargarTexturasuelo200(maping: L.Map): Promise<L.Layer> {
    const Texturasuelo200 = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:Textura_suelo_200',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(Texturasuelo200);
    return Texturasuelo200;
  }

  async cargarCobertura_uso_suelo(maping: L.Map): Promise<L.Layer> {
    const Fragmentos_gruesos_suelo = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:Cobertura_uso_suelo',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(Fragmentos_gruesos_suelo);
    return Fragmentos_gruesos_suelo;
  }

  async cargarTextura(maping: L.Map): Promise<L.Layer> {
    const Textura = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:textura',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(Textura);
    return Textura;
  }

  async cargarPrecipitacion(maping: L.Map): Promise<L.Layer> {
    const Precipitacion = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:Precipitacion',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(Precipitacion);
    return Precipitacion;
  }
  async cargarPendientes(maping: L.Map): Promise<L.Layer> {
    const Pendientes = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:Pendiente',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.5,
      crossOrigin: true,
    });

    maping.addLayer(Pendientes);
    return Pendientes;
  }
  
  async cargarTemperaturamedia(maping: L.Map): Promise<L.Layer> {
    const Temperaturamedia = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
      layers: 'capas_rastergeo:T_med_final',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(Temperaturamedia);
    return Temperaturamedia;
  }

  async cargarestanques(maping: L.Map): Promise<L.Layer> {
    const Temperaturamedia = L.tileLayer.wms("http://localhost:8085/geoserver/capas_geo/wms?", {
      layers: 'capas_geo:estanques_15000',
      format: 'image/png',
      transparent: true,
      version: '1.1.1',
      opacity: 0.8,
      crossOrigin: true,
    });

    maping.addLayer(Temperaturamedia);
    return Temperaturamedia;
  }

  async calculateCentroid(geojson: any): Promise<[number, number] | null> {
    try {
      if (geojson.type === 'MultiPolygon') {
        const coordinates = geojson.coordinates[0][0];
        
        let sumX = 0;
        let sumY = 0;
        
        coordinates.forEach((coord: number[]) => {
          sumX += coord[0];
          sumY += coord[1];
        });
        
        return [sumX / coordinates.length, sumY / coordinates.length];
      }
      return null;
    } catch (error) {
      console.error('Error al calcular centroide:', error);
      return null;
    }
  }
}