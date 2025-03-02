export interface DepartamentoInforDTO {
  
  departamento: string;
  provinciaPunto: string;
  municipioPunto: string;
  cuencaPunto: string;
  riosMunicipio: string;
  numeroMercados: number;
  numeroMercadosMunicipio: number;
  numeroProvincias: number;
  numeroMunicipios: number;

  porcentajeCoberturaArborea: number;
  porcentajeMatorral: number;
  porcentajePradera: number;
  porcentajeTierrasCultivo: number;
  porcentajeConstruido: number;
  porcentajeVegetacionDesnuda: number;
  porcentajeNieveHielo: number;
  porcentajeMasasAgua: number;
  porcentajeHumedalHerbaceo: number;

  porcentajeNoApta: number;
  porcentajeBajaIdoneidad: number;
  porcentajeModeradaIdoneidad: number;
  porcentajeAltaIdoneidad: number;

  valorMaximoFragmentos: number;
  totalPixelesFragmentos: number;

  porcentajeNoDato: number;
  porcentajeArcilloso: number;
  porcentajeArcilloArenoso: number;
  porcentajeFrancoArcilloso: number;
  porcentajeFrancoArcilloArenoso: number;
  porcentajeFranco: number;
  porcentajeFrancoLimoso: number;
  porcentajeFrancoArenoso: number;
}
