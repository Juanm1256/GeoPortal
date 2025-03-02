using System.Xml.Linq;
using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class Proveedor_AsistTecLogic : IProveedorAsisTecContrato
    {
        private readonly AppDbContext context;
        public Proveedor_AsistTecLogic(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<List<ProveedorAsisTec>> ListarTodos()
        {
            if (context.Database.ProviderName == "Microsoft.EntityFrameworkCore.InMemory")
            {
                return await context.ProveedorAsistenciaTecnica
                    .AsNoTracking()
                    .ToListAsync();
            }
            return await context.ProveedorAsistenciaTecnica
                .FromSqlRaw(@"
                    SELECT gid, name, long_x, lat_y, ST_AsGeoJSON(geom) AS geom FROM capas.proveedores_asistencia_tecnica")
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
