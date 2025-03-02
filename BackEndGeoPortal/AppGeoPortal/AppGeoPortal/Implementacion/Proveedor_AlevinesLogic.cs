using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class Proveedor_AlevinesLogic : IProveedorAContrato
    {
        private readonly AppDbContext context;
        public Proveedor_AlevinesLogic(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<Proveedor_A>> ListarTodos()
        {
            if (context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
            {
                return await context.ProveedorAlevies
                    .AsNoTracking()
                    .ToListAsync();
            }
            return await context.ProveedorAlevies
                .FromSqlRaw(@"
                    SELECT 
                        gid, 
                        name, 
                        x, 
                        y, 
                        ST_AsGeoJSON(geom) AS geom 
                    FROM capas.proveedores_alevines")
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
