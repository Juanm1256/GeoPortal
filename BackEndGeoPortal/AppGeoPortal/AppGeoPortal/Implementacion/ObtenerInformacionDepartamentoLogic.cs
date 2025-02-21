using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.DTO;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;
using NetTopologySuite;
using NetTopologySuite.Geometries;
using NetTopologySuite.IO;


namespace AppGeoPortal.Implementacion
{
    public class ObtenerInformacionDepartamentoLogic : IObtenerInformacionDepartamentoContrato
    {
        private readonly AppDbContext context;

        public ObtenerInformacionDepartamentoLogic(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<DepartamentoInfoDTO>> ListarTodos(double longitud, double latitud)
        {
            var resultado = await context.DepartamentoInfoDTOs
                .FromSqlRaw(@"
                    WITH punto AS (
                        SELECT ST_SetSRID(ST_MakePoint({0}, {1}), 4326) AS geom
                    ),
                    info_geografica AS (
                        SELECT 
                            COALESCE((SELECT dep FROM capas.limites_departamentales WHERE ST_Contains(geom, punto.geom)), 'N/A') AS Departamento,
                            COALESCE((SELECT prov FROM capas.limites_municipales WHERE ST_Contains(geom, punto.geom)), 'N/A') AS ProvinciaPunto,
                            COALESCE((SELECT mun FROM capas.limites_municipales WHERE ST_Contains(geom, punto.geom)), 'N/A') AS MunicipioPunto,
                            COALESCE((SELECT cuenca FROM capas.cuencas WHERE ST_Contains(geom, punto.geom)), 'N/A') AS CuencaPunto
                        FROM punto
                    ),
                    rios_municipio AS (
                        SELECT COALESCE(STRING_AGG(DISTINCT nom, ', '), 'N/A') AS NombreRios
                        FROM capas_geo.red_hidrica rh
                        JOIN capas.limites_municipales lm ON ST_Intersects(rh.geom, lm.geom)
                        WHERE ST_Contains(lm.geom, ST_SetSRID(ST_MakePoint({0}, {1}), 4326))
                    ),
                    mercados_municipio AS (
                        SELECT COALESCE(COUNT(*), 0) AS CantidadMercados
                        FROM capas.mercados_project mp
                        JOIN capas.limites_municipales lm ON 
                            REGEXP_REPLACE(UPPER(mp.municipio), '[DE\s]', '', 'g') 
                            LIKE 
                            REGEXP_REPLACE(UPPER(lm.mun), '[DE\s]', '', 'g')
                        WHERE ST_Contains(lm.geom, ST_SetSRID(ST_MakePoint({0}, {1}), 4326))
                    ),
                    consulta_principal AS (
                        SELECT 
                            COALESCE(UPPER(mp.departamen), 'N/A') AS Departamento,
                            ig.ProvinciaPunto,
                            ig.MunicipioPunto,
                            ig.CuencaPunto,
                            rm.NombreRios AS RiosMunicipio,
                            COALESCE(COUNT(DISTINCT mp.nombre), 0) AS NumeroMercados,
                            COALESCE((SELECT CantidadMercados FROM mercados_municipio), 0) AS NumeroMercadosMunicipio,
                            COALESCE(COUNT(DISTINCT lm.prov), 0) AS NumeroProvincias,
                            COALESCE(COUNT(DISTINCT lm.mun), 0) AS NumeroMunicipios
                        FROM 
                            capas.mercados_project mp
                        INNER JOIN 
                            capas.limites_departamentales ld ON UPPER(mp.departamen) = ld.dep
                        INNER JOIN
                            capas.limites_municipales lm ON UPPER(mp.departamen) = lm.dep
                        CROSS JOIN 
                            info_geografica ig
                        CROSS JOIN
                            rios_municipio rm
                        WHERE 
                            UPPER(mp.departamen) = ig.Departamento
                        GROUP BY 
                            mp.departamen, 
                            ig.ProvinciaPunto, 
                            ig.MunicipioPunto, 
                            ig.CuencaPunto,
                            rm.NombreRios
                    )
                    SELECT * FROM consulta_principal", longitud, latitud)
                .ToListAsync();

            if (!resultado.Any())
            {
                resultado.Add(new DepartamentoInfoDTO
                {
                    Departamento = "N/A",
                    ProvinciaPunto = "N/A",
                    MunicipioPunto = "N/A",
                    CuencaPunto = "N/A",
                    RiosMunicipio = "N/A",
                    NumeroMercados = 0,
                    NumeroMercadosMunicipio = 0,
                    NumeroProvincias = 0,
                    NumeroMunicipios = 0
                });
            }

            return resultado;
        }
    }
}
