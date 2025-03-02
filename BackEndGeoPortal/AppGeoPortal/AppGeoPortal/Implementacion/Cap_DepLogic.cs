using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class Cap_DepLogic : ICap_DepContrato
    {
        private readonly AppDbContext context;
        public Cap_DepLogic(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<Cap_Dep>> ListarTodos()
        {
            if (context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
            {
                return await context.Cap_Deps
                    .AsNoTracking()
                    .ToListAsync();
            }
            return await context.Cap_Deps
                .FromSqlRaw(@"
                    SELECT 
                        gid, 
                        objectid, 
                        cap_dep, 
                        cod_ine, 
                        ST_AsGeoJSON(geom) AS geom 
                    FROM capas.capitales_departamentales")
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
