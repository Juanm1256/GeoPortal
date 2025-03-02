using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AppGeoPortal.Implementacion
{
    public class CuencasLogic : ICuencasContrato
    {
        private readonly AppDbContext context;

        public CuencasLogic(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<Cuencas>> ListarTodos()
        {
            if (context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
            {
                return await context.Cuencas
                    .AsNoTracking()
                    .ToListAsync();
            }

            return await context.Cuencas
                .FromSqlRaw("SELECT gid, sup_km2, cuenca, ST_AsGeoJSON(geom) AS geom FROM capas.cuencas")
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
