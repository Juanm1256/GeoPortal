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
    }
}
