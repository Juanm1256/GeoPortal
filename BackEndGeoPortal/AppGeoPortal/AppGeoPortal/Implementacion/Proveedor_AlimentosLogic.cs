using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class Proveedor_AlimentosLogic : IProveedorAliContrato
    {
        private readonly AppDbContext context;
        public Proveedor_AlimentosLogic(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<ProveedorAli>> ListarTodos()
        {
            if (context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
            {
                return await context.ProveedorAlimentos
                    .AsNoTracking()
                    .ToListAsync();
            }
            return await context.ProveedorAlimentos
                .FromSqlRaw(@"
                    SELECT 
                        gid, 
                        oid_, 
                        name, 
                        ST_AsGeoJSON(geom) AS geom 
                    FROM capas.proveedores_alimentos")
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
