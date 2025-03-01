using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class Limites_MunicipalesLogic : ILim_MunContrato
    {
        private readonly AppDbContext context;
        public Limites_MunicipalesLogic(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<List<Lim_Mun>> ListarTodos()
        {
            if (context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
            {
                return await context.Lim_Muns
                    .AsNoTracking()
                    .ToListAsync();
            }

            return await context.Lim_Muns
                .FromSqlRaw(@"SELECT gid, dep, prov, mun, cod_dep, cod_prov, cod_mun, 
                             shape_leng, shape_area, 
                             ST_AsGeoJSON(ST_Transform(geom, 4326)) AS geom 
                      FROM capas.limites_municipales")
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
