using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class MercadosLogic : IMercadoContrato
    {
        private readonly AppDbContext context;
        public MercadosLogic(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<List<Mercados>> ListarTodos()
        {
            if (context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
            {
                return await context.Mercados
                    .AsNoTracking()
                    .ToListAsync();
            }

            return await context.Mercados
                .FromSqlRaw(@"
            SELECT 
                gid, 
                ogc_fid, 
                departamen, 
                provincia, 
                municipio, 
                ciudad, 
                nombre, 
                ST_AsGeoJSON(geom) AS geom 
            FROM capas.mercados_project")
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
