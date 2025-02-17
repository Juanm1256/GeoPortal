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

    public CargarCapitalesDepartamentales(map: L.Map, capitalesDepartamentalesService: any ): L.LayerGroup {
        const layerGroup = L.layerGroup();
    
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
            }
        });
    
        return layerGroup;
    }

    public CargarCuencas(maping: L.Map, cuencasService: any): L.LayerGroup {
      const layerGroup = L.layerGroup();
      
      cuencasService.listarTodos().subscribe((cuencas: Cuencas[]) => {
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
                  layer.bindPopup(`
                                <div class="popup-content">
                                    <h4>${cuenca.cuenca}</h4>
                                    <p>Superficie: ${cuenca.sup_km2} km²</p>
                                </div>
                            `);

                  layer.on({
                    mouseup: (e) => {
                      const layer = e.target;
                      layer.setStyle({
                        weight: 3,
                        fillOpacity: 0.2,
                        color: colorMouseOver,
                        fillColor: ColoresMapaUtil.ajustarOpacidadColor(colorMouseOver, 1)
                      });
                    }
                  });
                }
              });

              layerGroup.addLayer(polygon);
            }
          }
        });
      });

      maping.addLayer(layerGroup);
      return layerGroup;
    }
    
    public Cargarmercados(maping: L.Map, mercadoservices: any): L.Layer {
        const markerCluster = L.markerClusterGroup();
    
        mercadoservices.listarTodos().subscribe((mercados: Mercados[]) => {
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
    
          maping.addLayer(markerCluster);
        });
    
        return markerCluster;
      }

      public CargarLimitesDepartamentales(maping: L.Map, limitesdepservice: any): L.Layer {
          const layerGroup = L.layerGroup();
      
          limitesdepservice.listarTodos().subscribe((lim_deps: LimitesDepartamentales[]) => {
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
                        mouseup: (e) => {
                          const layer = e.target;
                          layer.setStyle({
                            weight: 3,
                            fillOpacity: 0.2,
                            color: colorMouseOver,
                            fillColor: ColoresMapaUtil.ajustarOpacidadColor(colorMouseOver, 1)
                          });
                        }
                      });
                    }
                  });
      
                  layerGroup.addLayer(polygon);
                }
              }
            });
          });
      
          maping.addLayer(layerGroup);
          return layerGroup;
    }

    public CargarLimitesMunicipales(maping: L.Map, limitesmuservice: any): L.Layer {
        const layerGroup = L.layerGroup();
      
        limitesmuservice.listarTodos().subscribe((lim_muns: LimitesMunicipales[]) => {
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
                      layer.bindPopup(`
                                    <div class="popup-content">
                                        <h4>${lim_mun.dep}</h4>
                                        <p>Provincia: ${lim_mun.prov}</p>
                                        <p>Municipio: ${lim_mun.mun}</p>
                                    </div>
                                `);
      
                      layer.on({
                        mouseup: (e) => {
                          const layer = e.target;
                          layer.setStyle({
                            weight: 3,
                            fillOpacity: 0.2,
                            color: colorMouseOver,
                            fillColor: ColoresMapaUtil.ajustarOpacidadColor(colorMouseOver, 1)
                          });
                        }
                      });
                    }
                  });
      
                  layerGroup.addLayer(polygon);
                }
              }
            });
        });
      
         maping.addLayer(layerGroup);
        return layerGroup;
    }

    public CargarProveedorAlevines(maping: L.Map, proveedoralevinesservice: any): L.Layer {
        const layerGroup = L.layerGroup();
    
        proveedoralevinesservice.listarTodos().subscribe((proveedores: ProveedorAlevines[]) => {
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
        });
    
        return layerGroup;
    }

    public CargarProveedorAlimentos(maping: L.Map, proveedoralimentoservice: any): L.Layer {
        const layerGroup = L.layerGroup();
    
        proveedoralimentoservice.listarTodos().subscribe((datos: ProveedorAlimentos[]) => {
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
        });
    
        return layerGroup;
    }
    
    public  CargarProveedoresAsistenciaTecnica(maping: L.Map, proveedorasistenciatecnicaservice: any): L.Layer {
        const layerGroup = L.layerGroup();
    
        proveedorasistenciatecnicaservice.listarTodos().subscribe((proveedores: ProveedorAsistenciaTecnica[]) => {
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
        });
    
        return layerGroup;
    }

    public CargarRedCaminos(maping: L.Map): L.Layer {
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
      
      
    public CargarRedHidrica(maping: L.Map): L.Layer {
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
    
    public cargarmodgene(maping: L.Map): L.Layer {
        const redHidrica = L.tileLayer.wms("http://localhost:8085/geoserver/capas_rastergeo/wms?", {
          layers: 'capas_rastergeo:mod_gen_ajustado',
          format: 'image/png',
          transparent: true,
          version: '1.1.1',
          opacity: 0.8,
          crossOrigin: true,
        });
    
        maping.addLayer(redHidrica);
        return redHidrica;
      }
}