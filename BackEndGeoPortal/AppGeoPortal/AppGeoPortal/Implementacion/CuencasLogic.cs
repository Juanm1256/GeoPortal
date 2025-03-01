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
            // Si estás en base de datos en memoria, usa consulta normal
            if (context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
            {
                return await context.Cuencas
                    .AsNoTracking()
                    .ToListAsync();
            }

            // Para bases de datos reales, usa consulta SQL
            return await context.Cuencas
                .FromSqlRaw("SELECT gid, sup_km2, cuenca, ST_AsGeoJSON(geom) AS geom FROM capas.cuencas")
                .AsNoTracking()
                .ToListAsync();
        }

    }
}
