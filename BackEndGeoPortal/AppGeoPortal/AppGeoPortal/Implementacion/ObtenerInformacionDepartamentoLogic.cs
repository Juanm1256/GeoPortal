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
                    ubicacion_actual AS (
                        -- Primero identificamos el departamento y municipio donde está el punto
                        SELECT 
                            COALESCE(ld.dep, 'N/A') AS departamento,
                            COALESCE(lm.mun, 'N/A') AS municipio,
                            COALESCE(lm.prov, 'N/A') AS provincia
                        FROM punto p
                        LEFT JOIN capas.limites_departamentales ld ON ST_Contains(ST_Transform(ld.geom, 4326), p.geom) 
                        LEFT JOIN capas.limites_municipales lm ON ST_Contains(ST_Transform(lm.geom, 4326), p.geom)
                        LIMIT 1
                    ),
                    info_geografica AS (
                        SELECT 
                            ua.departamento AS Departamento,
                            ua.provincia AS ProvinciaPunto,
                            ua.municipio AS MunicipioPunto,
                            COALESCE((SELECT cuenca FROM capas.cuencas 
                                     WHERE ST_Contains(ST_Transform(geom, 4326), (SELECT geom FROM punto))
                                     LIMIT 1), 'N/A') AS CuencaPunto
                        FROM ubicacion_actual ua
                    ),
                    rios_municipio AS (
                        SELECT COALESCE(STRING_AGG(DISTINCT rh.nom, ', '), 'N/A') AS NombreRios
                        FROM capas_geo.red_hidrica rh
                        JOIN capas.limites_municipales lm ON 
                            ST_Intersects(ST_Transform(rh.geom, 4326), ST_Transform(lm.geom, 4326))
                            AND lm.mun = (SELECT municipio FROM ubicacion_actual)
                            AND lm.dep = (SELECT departamento FROM ubicacion_actual)
                    ),
                    mercados_municipio AS (
                        -- Contamos solo los mercados que están en el municipio Y departamento correcto
                        SELECT COUNT(*) AS CantidadMercados
                        FROM capas.mercados_project mp
                        JOIN ubicacion_actual ua ON 
                            UPPER(mp.municipio) = UPPER(ua.municipio) AND
                            UPPER(mp.departamen) = UPPER(ua.departamento)
                    ),
                    consulta_principal AS (
                        SELECT 
                            ig.Departamento,
                            ig.ProvinciaPunto,
                            ig.MunicipioPunto,
                            ig.CuencaPunto,
                            rm.NombreRios AS RiosMunicipio,
                            -- Mercados en todo el departamento
                            COALESCE((
                                SELECT COUNT(DISTINCT mp.nombre) 
                                FROM capas.mercados_project mp 
                                WHERE UPPER(mp.departamen) = UPPER(ig.Departamento)
                            ), 0) AS NumeroMercados,
                            -- Mercados solo en el municipio específico del departamento correcto
                            COALESCE((SELECT CantidadMercados FROM mercados_municipio), 0) AS NumeroMercadosMunicipio,
                            -- Provincias en el departamento
                            COALESCE((
                                SELECT COUNT(DISTINCT lm.prov) 
                                FROM capas.limites_municipales lm 
                                WHERE UPPER(lm.dep) = UPPER(ig.Departamento)
                            ), 0) AS NumeroProvincias,
                            -- Municipios en el departamento
                            COALESCE((
                                SELECT COUNT(DISTINCT lm.mun) 
                                FROM capas.limites_municipales lm 
                                WHERE UPPER(lm.dep) = UPPER(ig.Departamento)
                            ), 0) AS NumeroMunicipios
                        FROM 
                            info_geografica ig
                        CROSS JOIN 
                            rios_municipio rm
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
