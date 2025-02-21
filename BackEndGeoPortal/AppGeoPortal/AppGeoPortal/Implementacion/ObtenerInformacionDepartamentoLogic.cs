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
                            (SELECT dep FROM capas.limites_departamentales WHERE ST_Contains(geom, punto.   geom))     AS      Departamento,
                            (SELECT prov FROM capas.limites_municipales WHERE ST_Contains(geom, punto.geom))    AS         ProvinciaPunto,
                            (SELECT mun FROM capas.limites_municipales WHERE ST_Contains(geom, punto.geom))     AS      MunicipioPunto,
                            (SELECT cuenca FROM capas.cuencas WHERE ST_Contains(geom, punto.geom)) AS CuencaPunto
                        FROM punto
                    ),
                    rios_municipio AS (
                        SELECT STRING_AGG(DISTINCT nom, ', ') AS NombreRios
                        FROM capas_geo.red_hidrica rh
                        JOIN capas.limites_municipales lm ON ST_Intersects(rh.geom, lm.geom)
                        WHERE ST_Contains(lm.geom, ST_SetSRID(ST_MakePoint({0}, {1}), 4326))
                    ),
                    mercados_municipio AS (
                        SELECT COUNT(DISTINCT mp.nombre) AS CantidadMercados
                        FROM capas.mercados_project mp
                        JOIN capas.limites_municipales lm ON UPPER(mp.municipio) = UPPER(lm.mun)
                        WHERE ST_Contains(lm.geom, ST_SetSRID(ST_MakePoint({0}, {1}), 4326))
                    ),
                    consulta_principal AS (
                        SELECT 
                            UPPER(mp.departamen) AS Departamento,
                            ig.ProvinciaPunto,
                            ig.MunicipioPunto,
                            ig.CuencaPunto,
                            rm.NombreRios AS RiosMunicipio,
                            COUNT(DISTINCT mp.nombre) AS NumeroMercados,
                            (SELECT CantidadMercados FROM mercados_municipio) AS NumeroMercadosMunicipio,
                            COUNT(DISTINCT lm.prov) AS NumeroProvincias,
                            COUNT(DISTINCT lm.mun) AS NumeroMunicipios
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
            return resultado;
        }
    }
}
