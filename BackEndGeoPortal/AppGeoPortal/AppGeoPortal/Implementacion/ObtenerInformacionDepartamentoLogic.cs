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
    SELECT 
        COALESCE(CAST(ld.dep AS text), 'N/A') AS departamento,
        COALESCE(CAST(lm.mun AS text), 'N/A') AS municipio,
        COALESCE(CAST(lm.prov AS text), 'N/A') AS provincia,
        ST_Transform(lm.geom, 4326) AS geom_municipio
    FROM punto p
    LEFT JOIN capas.limites_departamentales ld ON ST_Contains(ST_Transform(ld.geom, 4326), p.geom) 
    LEFT JOIN capas.limites_municipales lm ON ST_Contains(ST_Transform(lm.geom, 4326), p.geom)
    LIMIT 1
),
info_geografica AS (
    SELECT 
        (SELECT departamento FROM ubicacion_actual) AS Departamento,
        (SELECT provincia FROM ubicacion_actual) AS ProvinciaPunto,
        (SELECT municipio FROM ubicacion_actual) AS MunicipioPunto,
        COALESCE((
            SELECT cuenca::text 
            FROM capas.cuencas 
            WHERE ST_Contains(ST_Transform(geom, 4326), (SELECT geom FROM punto))
            LIMIT 1
        ), 'N/A') AS CuencaPunto
),
texturainfo AS (
    SELECT 
        ti.municipio,
        ti.no_dato,
        ti.arcilloso,
        ti.arcillo_arenoso,
        ti.franco_arcilloso,
        ti.franco_arcillo_arenoso,
        ti.franco,
        ti.franco_limoso,
        ti.franco_arenoso,
        ti.total
    FROM info.Texturainfo ti
    CROSS JOIN ubicacion_actual ua
    WHERE UPPER(ti.municipio) = UPPER(ua.municipio)
),
rios_municipio AS (
    SELECT COALESCE(STRING_AGG(DISTINCT rh.nom::text, ', '), 'N/A') AS NombreRios
    FROM capas_geo.red_hidrica rh
    CROSS JOIN ubicacion_actual ua
    JOIN capas.limites_municipales lm ON 
        ST_Intersects(ST_Transform(rh.geom, 4326), ST_Transform(lm.geom, 4326))
        AND lm.mun::text = ua.municipio
        AND lm.dep::text = ua.departamento
),
mercados_municipio AS (
    SELECT COUNT(*) AS CantidadMercados
    FROM capas.mercados_project mp
    CROSS JOIN ubicacion_actual ua
    WHERE 
        UPPER(mp.municipio) = UPPER(ua.municipio) AND
        UPPER(mp.departamen) = UPPER(ua.departamento)
),
valores_raster_cobus AS (
    SELECT 
        ua.departamento,
        ua.municipio,
        (ST_ValueCount(ST_Clip(rast, ua.geom_municipio, 1))).value AS valor,
        (ST_ValueCount(ST_Clip(rast, ua.geom_municipio, 1))).count AS num_pixeles
    FROM 
        capas_rastergeo.cobertura_uso_suelo raster,
        ubicacion_actual ua
    WHERE 
        ST_Intersects(rast, ua.geom_municipio)
),
valores_raster_mod_general AS (
    SELECT 
        ua.departamento,
        ua.municipio,
        (ST_ValueCount(ST_Clip(rast, ua.geom_municipio, 1))).value AS valor,
        (ST_ValueCount(ST_Clip(rast, ua.geom_municipio, 1))).count AS num_pixeles
    FROM 
        capas_rastergeo.mod_general raster,
        ubicacion_actual ua
    WHERE 
        ST_Intersects(rast, ua.geom_municipio)
),
valores_raster_fragmentos_gruesos AS (
    SELECT 
        ua.departamento,
        ua.municipio,
        (ST_ValueCount(ST_Clip(rast, ua.geom_municipio, 1))).value AS valor,
        (ST_ValueCount(ST_Clip(rast, ua.geom_municipio, 1))).count AS num_pixeles
    FROM 
        capas_rastergeo.fragmentos_gruesos_suelo raster,
        ubicacion_actual ua
    WHERE 
        ST_Intersects(rast, ua.geom_municipio)
),
totales_raster_cobus AS (
    SELECT 
        departamento,
        municipio,
        SUM(num_pixeles) AS total_pixeles
    FROM valores_raster_cobus
    GROUP BY departamento, municipio
),
totales_raster_mod_general AS (
    SELECT 
        departamento,
        municipio,
        SUM(num_pixeles) AS total_pixeles
    FROM valores_raster_mod_general
    GROUP BY departamento, municipio
),
totales_raster_fragmentos_gruesos AS (
    SELECT 
        departamento,
        municipio,
        SUM(num_pixeles) AS total_pixeles
    FROM valores_raster_fragmentos_gruesos
    GROUP BY departamento, municipio
),
distribucion_raster_cobus AS (
    SELECT 
        departamento,
        municipio,
        ROUND(SUM(CASE WHEN valor = 10 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_cobertura_arborea,
        ROUND(SUM(CASE WHEN valor = 20 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_matorral,
        ROUND(SUM(CASE WHEN valor = 30 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_pradera,
        ROUND(SUM(CASE WHEN valor = 40 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_tierras_cultivo,
        ROUND(SUM(CASE WHEN valor = 50 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_construido,
        ROUND(SUM(CASE WHEN valor = 60 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_vegetacion_desnuda,
        ROUND(SUM(CASE WHEN valor = 70 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_nieve_hielo,
        ROUND(SUM(CASE WHEN valor = 80 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_masas_agua,
        ROUND(SUM(CASE WHEN valor = 90 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_humedal_herbaceo
    FROM (
        SELECT 
            vrm.departamento,
            vrm.municipio,
            vrm.valor,
            vrm.num_pixeles,
            trm.total_pixeles
        FROM valores_raster_cobus vrm
        JOIN totales_raster_cobus trm ON 
            vrm.departamento = trm.departamento AND 
            vrm.municipio = trm.municipio
    ) subquery
    GROUP BY departamento, municipio, total_pixeles
),
distribucion_raster_mod_general AS (
    SELECT 
        departamento,
        municipio,
        ROUND(SUM(CASE WHEN valor = 1 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_no_apta,
        ROUND(SUM(CASE WHEN valor = 2 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_baja_idoneidad,
        ROUND(SUM(CASE WHEN valor = 3 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_moderada_idoneidad,
        ROUND(SUM(CASE WHEN valor = 4 THEN num_pixeles ELSE 0 END) * 100.0 / total_pixeles, 2) AS porcentaje_alta_idoneidad
    FROM (
        SELECT 
            vrm.departamento,
            vrm.municipio,
            vrm.valor,
            vrm.num_pixeles,
            trm.total_pixeles
        FROM valores_raster_mod_general vrm
        JOIN totales_raster_mod_general trm ON 
            vrm.departamento = trm.departamento AND 
            vrm.municipio = trm.municipio
    ) subquery
    GROUP BY departamento, municipio, total_pixeles
),
distribucion_raster_fragmentos_gruesos AS (
    SELECT 
        departamento,
        municipio,
        MAX(valor) AS valor_maximo_fragmentos,
        SUM(num_pixeles) AS total_pixeles_fragmentos
    FROM valores_raster_fragmentos_gruesos
    GROUP BY departamento, municipio
),
consulta_principal AS (
    SELECT 
        ig.Departamento,
        ig.ProvinciaPunto,
        ig.MunicipioPunto,
        ig.CuencaPunto,
        rm.NombreRios AS RiosMunicipio,
        COALESCE((
            SELECT COUNT(DISTINCT mp.nombre) 
            FROM capas.mercados_project mp 
            CROSS JOIN ubicacion_actual ua
            WHERE UPPER(mp.departamen) = UPPER(ua.departamento)
        ), 0) AS NumeroMercados,
        COALESCE((SELECT CantidadMercados FROM mercados_municipio), 0) AS NumeroMercadosMunicipio,
        COALESCE((
            SELECT COUNT(DISTINCT lm.prov::text) 
            FROM capas.limites_municipales lm 
            CROSS JOIN ubicacion_actual ua
            WHERE UPPER(lm.dep::text) = UPPER(ua.departamento)
        ), 0) AS NumeroProvincias,
        COALESCE((
            SELECT COUNT(DISTINCT lm.mun::text) 
            FROM capas.limites_municipales lm 
            CROSS JOIN ubicacion_actual ua
            WHERE UPPER(lm.dep::text) = UPPER(ua.departamento)
        ), 0) AS NumeroMunicipios,
        drcobus.porcentaje_cobertura_arborea,
        drcobus.porcentaje_matorral,
        drcobus.porcentaje_pradera,
        drcobus.porcentaje_tierras_cultivo,
        drcobus.porcentaje_construido,
        drcobus.porcentaje_vegetacion_desnuda,
        drcobus.porcentaje_nieve_hielo,
        drcobus.porcentaje_masas_agua,
        drcobus.porcentaje_humedal_herbaceo,
        drmod.porcentaje_no_apta,
        drmod.porcentaje_baja_idoneidad,
        drmod.porcentaje_moderada_idoneidad,
        drmod.porcentaje_alta_idoneidad,
        drfrag.valor_maximo_fragmentos,
        drfrag.total_pixeles_fragmentos,
        txt.no_dato,
        txt.arcilloso,
        txt.arcillo_arenoso,
        txt.franco_arcilloso,
        txt.franco_arcillo_arenoso,
        txt.franco,
        txt.franco_limoso,
        txt.franco_arenoso,
        txt.total AS total_textura
    FROM 
        info_geografica ig
    CROSS JOIN 
        rios_municipio rm
    JOIN 
        distribucion_raster_cobus drcobus ON 
        drcobus.departamento = ig.Departamento AND 
        drcobus.municipio = ig.MunicipioPunto
    JOIN 
        distribucion_raster_mod_general drmod ON 
        drmod.departamento = ig.Departamento AND 
        drmod.municipio = ig.MunicipioPunto
    JOIN 
        distribucion_raster_fragmentos_gruesos drfrag ON 
        drfrag.departamento = ig.Departamento AND 
        drfrag.municipio = ig.MunicipioPunto
    LEFT JOIN 
        texturainfo txt ON 
        txt.municipio = ig.MunicipioPunto
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
                    NumeroMunicipios = 0,
                    porcentaje_cobertura_arborea = 0.0,
                    porcentaje_matorral = 0.0,
                    porcentaje_pradera = 0.0,
                    porcentaje_tierras_cultivo = 0.0,
                    porcentaje_construido = 0.0,
                    porcentaje_vegetacion_desnuda = 0.0,
                    porcentaje_nieve_hielo = 0.0,
                    porcentaje_masas_agua = 0.0,
                    porcentaje_humedal_herbaceo = 0.0,
                    porcentaje_no_apta = 0.0,
                    porcentaje_baja_idoneidad = 0.0,
                    porcentaje_moderada_idoneidad = 0.0,
                    porcentaje_alta_idoneidad = 0.0,
                    valor_maximo_fragmentos = 0,
                    total_pixeles_fragmentos = 0,
                    no_dato = 0.0,
                    arcilloso = 0.0,
                    arcillo_arenoso = 0.0,
                    franco_arcilloso = 0.0,
                    franco_arcillo_arenoso = 0.0,
                    franco = 0.0,
                    franco_limoso = 0.0,
                    franco_arenoso = 0.0
                });
            }

            return resultado;
        }
    }
}