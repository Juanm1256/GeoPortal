using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class Limites_DepartamentalesLogic : ILim_DepartContrato
    {
        private readonly AppDbContext context;
        public Limites_DepartamentalesLogic(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<List<Lim_Dep>> ListarTodos()
        {
            if (context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
            {
                return await context.Lim_Deps
                    .AsNoTracking()
                    .ToListAsync();
            }
            return await context.Lim_Deps
                .FromSqlRaw(@"SELECT gid, dep, cod_dep, shape_leng, shape_area, 
                             ST_AsGeoJSON(geom) AS geom 
                      FROM capas.limites_departamentales")
                .AsNoTracking()
                .ToListAsync();
        }

    }
}
