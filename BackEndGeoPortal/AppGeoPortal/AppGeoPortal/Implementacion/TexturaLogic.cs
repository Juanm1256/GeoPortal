using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.DTO;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class TexturaLogic : ITexturaContrato
    {
        private readonly AppDbContext context;

        public TexturaLogic(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<TexturaDTO>> ListarTexturasuelocero()
        {
            // Verificar si estamos usando InMemoryDatabase
            var isInMemory = context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory";

            if (isInMemory)
            {
                // Si la BD es InMemory, simplemente devolvemos los datos almacenados
                return await context.Texturas
                    .Select(t => new TexturaDTO
                    {
                        Value = t.Value,
                        Porcentaje = t.Porcentaje
                    })
                    .ToListAsync();
            }
            var resultado = await context.Texturas
                .FromSqlRaw(@"
            WITH stats AS (
                SELECT (ST_ValueCount(rast)).*  
                FROM capas_rastergeo.textura_suelo_cero
            ),
            total AS (
                SELECT SUM(count) as total_count
                FROM stats
            ),
            porcentajes AS (
                SELECT 
                    0 as rid,
                    value as ""Value"", 
                    0 as ""Count"",
                    ROUND((SUM(count) * 100.0 / (SELECT total_count FROM total)), 1) as ""Porcentaje""
                FROM stats
                GROUP BY value
            )
            SELECT *
            FROM porcentajes
            ORDER BY ""Value"" DESC")
                .Select(r => new TexturaDTO
                {
                    Value = r.Value,
                    Porcentaje = r.Porcentaje
                })
                .ToListAsync();

            return resultado;
        }

        public async Task<List<TexturaDTO>> ListarTexturasuelodiez()
        {
            var resultado = await context.Texturas
                .FromSqlRaw(@"
            WITH stats AS (
                SELECT (ST_ValueCount(rast)).*  
                FROM capas_rastergeo.textura_suelo_diez
            ),
            total AS (
                SELECT SUM(count) as total_count
                FROM stats
            ),
            porcentajes AS (
                SELECT 
                    0 as rid,
                    value as ""Value"", 
                    0 as ""Count"",
                    ROUND((SUM(count) * 100.0 / (SELECT total_count FROM total)), 1) as ""Porcentaje""
                FROM stats
                GROUP BY value
            )
            SELECT *
            FROM porcentajes
            ORDER BY ""Value"" DESC")
                .Select(r => new TexturaDTO
                {
                    Value = r.Value,
                    Porcentaje = r.Porcentaje
                })
                .ToListAsync();

            return resultado;
        }

        public async Task<List<TexturaDTO>> ListarTexturasuelotreinta()
        {
            var resultado = await context.Texturas
                .FromSqlRaw(@"
            WITH stats AS (
                SELECT (ST_ValueCount(rast)).*  
                FROM capas_rastergeo.textura_suelo_treinta
            ),
            total AS (
                SELECT SUM(count) as total_count
                FROM stats
            ),
            porcentajes AS (
                SELECT 
                    0 as rid,
                    value as ""Value"", 
                    0 as ""Count"",
                    ROUND((SUM(count) * 100.0 / (SELECT total_count FROM total)), 1) as ""Porcentaje""
                FROM stats
                GROUP BY value
            )
            SELECT *
            FROM porcentajes
            ORDER BY ""Value"" DESC")
                .Select(r => new TexturaDTO
                {
                    Value = r.Value,
                    Porcentaje = r.Porcentaje
                })
                .ToListAsync();

            return resultado;
        }
        public async Task<List<TexturaDTO>> ListarTexturasuelosesenta()
        {
            var resultado = await context.Texturas
                .FromSqlRaw(@"
            WITH stats AS (
                SELECT (ST_ValueCount(rast)).*  
                FROM capas_rastergeo.textura_suelo_sesenta
            ),
            total AS (
                SELECT SUM(count) as total_count
                FROM stats
            ),
            porcentajes AS (
                SELECT 
                    0 as rid,
                    value as ""Value"", 
                    0 as ""Count"",
                    ROUND((SUM(count) * 100.0 / (SELECT total_count FROM total)), 1) as ""Porcentaje""
                FROM stats
                GROUP BY value
            )
            SELECT *
            FROM porcentajes
            ORDER BY ""Value"" DESC")
                .Select(r => new TexturaDTO
                {
                    Value = r.Value,
                    Porcentaje = r.Porcentaje
                })
                .ToListAsync();

            return resultado;
        }
        public async Task<List<TexturaDTO>> ListarTexturasuelocien()
        {
            var resultado = await context.Texturas
                .FromSqlRaw(@"
            WITH stats AS (
                SELECT (ST_ValueCount(rast)).*  
                FROM capas_rastergeo.textura_suelo_cien
            ),
            total AS (
                SELECT SUM(count) as total_count
                FROM stats
            ),
            porcentajes AS (
                SELECT 
                    0 as rid,
                    value as ""Value"", 
                    0 as ""Count"",
                    ROUND((SUM(count) * 100.0 / (SELECT total_count FROM total)), 1) as ""Porcentaje""
                FROM stats
                GROUP BY value
            )
            SELECT *
            FROM porcentajes
            ORDER BY ""Value"" DESC")
                .Select(r => new TexturaDTO
                {
                    Value = r.Value,
                    Porcentaje = r.Porcentaje
                })
                .ToListAsync();

            return resultado;
        }
        public async Task<List<TexturaDTO>> ListarTexturasuelodoscientos()
        {
            var resultado = await context.Texturas
                .FromSqlRaw(@"
            WITH stats AS (
                SELECT (ST_ValueCount(rast)).*  
                FROM capas_rastergeo.textura_suelo_doscientos
            ),
            total AS (
                SELECT SUM(count) as total_count
                FROM stats
            ),
            porcentajes AS (
                SELECT 
                    0 as rid,
                    value as ""Value"", 
                    0 as ""Count"",
                    ROUND((SUM(count) * 100.0 / (SELECT total_count FROM total)), 1) as ""Porcentaje""
                FROM stats
                GROUP BY value
            )
            SELECT *
            FROM porcentajes
            ORDER BY ""Value"" DESC")
                .Select(r => new TexturaDTO
                {
                    Value = r.Value,
                    Porcentaje = r.Porcentaje
                })
                .ToListAsync();

            return resultado;
        }
        
        public async Task<List<ModGeneralDTO>> ListarModGen()
        {
            var resultado = await context.Mod_General
                .FromSqlRaw(@"
                    WITH valores_raster AS (
                        SELECT 
                            (ST_ValueCount(rast, 1)).value AS valor,
                            (ST_ValueCount(rast, 1)).count AS num_pixeles
                        FROM capas_rastergeo.mod_general
                    ),
                    totales AS (
                        SELECT 
                            SUM(num_pixeles) AS total_pixeles
                        FROM valores_raster
                    ),
                    distribucion_raster AS (
                        SELECT 
                            CASE 
                                WHEN valor = 1 THEN 'No apta'
                                WHEN valor = 2 THEN 'Baja idoneidad'
                                WHEN valor = 3 THEN 'Moderada idoneidad'
                                WHEN valor = 4 THEN 'Alta idoneidad'
                                ELSE 'Sin clasificación'
                            END AS categoria,
                            ROUND(SUM(num_pixeles) * 100.0 / (SELECT total_pixeles FROM totales), 2) AS porcentaje
                        FROM valores_raster
                        GROUP BY 
                            CASE 
                                WHEN valor = 1 THEN 'No apta'
                                WHEN valor = 2 THEN 'Baja idoneidad'
                                WHEN valor = 3 THEN 'Moderada idoneidad'
                                WHEN valor = 4 THEN 'Alta idoneidad'
                                ELSE 'Sin clasificación'
                            END
                    )
                    SELECT 
                        categoria,
                        porcentaje
                    FROM distribucion_raster
                    ORDER BY categoria")
                .Select(r => new ModGeneralDTO
                {
                    categoria = r.categoria,
                    porcentaje = r.porcentaje
                })
                .ToListAsync();

            return resultado;
        }

        public async Task<List<ModGeneralDTO>> ListarTexturas()
        {
            var resultado = await context.Mod_General
                .FromSqlRaw(@"
            
            WITH valores_raster AS (
                SELECT 
                    (ST_ValueCount(rast, 1)).value AS valor,
                    (ST_ValueCount(rast, 1)).count AS num_pixeles
                FROM capas_rastergeo.textura
            ),
            totales AS (
                SELECT 
                    SUM(num_pixeles) AS total_pixeles
                FROM valores_raster
            ),
            distribucion_raster AS (
                SELECT 
                    CASE 
                        WHEN valor = 0 THEN 'No dato'
                        WHEN valor = 1 THEN 'Arcilloso'
                        WHEN valor = 3 THEN 'Arcillo Arenoso'
                        WHEN valor = 4 THEN 'Franco Arcilloso'
                        WHEN valor = 6 THEN 'Franco Arcillo Arenoso'
                        WHEN valor = 7 THEN 'Franco'
                        WHEN valor = 8 THEN 'Franco Limoso'
                        WHEN valor = 9 THEN 'Franco Arenoso'
                    END AS categoria,
                    valor,
                    SUM(num_pixeles) AS num_pixeles,
                    ROUND(SUM(num_pixeles) * 100.0 / (SELECT total_pixeles FROM totales), 2) AS porcentaje
                FROM valores_raster
                GROUP BY valor
            )
            SELECT 
                categoria,
                porcentaje
            FROM distribucion_raster
            ORDER BY valor")
                .Select(r => new ModGeneralDTO
                {
                    categoria = r.categoria,
                    porcentaje = r.porcentaje
                })
                .ToListAsync();
            return resultado;
        }
        public async Task<List<ModGeneralDTO>> Listarcategoria_uso()
        {
            var resultado = await context.Mod_General
                .FromSqlRaw(@"
    WITH valores_raster AS (
        SELECT 
            (ST_ValueCount(rast, 1)).value AS valor,
            (ST_ValueCount(rast, 1)).count AS num_pixeles
        FROM capas_rastergeo.cobertura_uso_suelo
    ),
    totales AS (
        SELECT 
            SUM(num_pixeles) AS total_pixeles
        FROM valores_raster
        WHERE valor IN (10, 20, 30, 40, 50, 60, 70, 80, 90)
    ),
    distribucion_raster AS (
        SELECT 
            CASE 
                WHEN valor = 10 THEN 'Cobertura arbórea'
                WHEN valor = 20 THEN 'Matorral'
                WHEN valor = 30 THEN 'Pradera'
                WHEN valor = 40 THEN 'Tierras de cultivo'
                WHEN valor = 50 THEN 'Construido'
                WHEN valor = 60 THEN 'Vegetación desnuda/rala'
                WHEN valor = 70 THEN 'Nieve y hielo'
                WHEN valor = 80 THEN 'Masas de agua permanentes'
                WHEN valor = 90 THEN 'Humedal herbáceo'
            END AS categoria,
            valor,
            SUM(num_pixeles) AS num_pixeles,
            ROUND(SUM(num_pixeles) * 100.0 / (SELECT total_pixeles FROM totales), 2) AS porcentaje
        FROM valores_raster
        WHERE valor IN (10, 20, 30, 40, 50, 60, 70, 80, 90)
        GROUP BY valor
    )
    SELECT 
        categoria,
        porcentaje
    FROM distribucion_raster
    ORDER BY valor")
                .Select(r => new ModGeneralDTO
                {
                    categoria = r.categoria,
                    porcentaje = r.porcentaje
                })
                .ToListAsync();
            return resultado;
        }
    }
}
