using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class EstanquesLogic : IEstanquesContrato
    {
        private readonly AppDbContext context;

        public EstanquesLogic(AppDbContext context)
        {
            this.context = context;
        }

        public async Task<List<Estanques>> ListarTodosPaginados(int pagina = 1, int tamañoPagina = 100)
        {
            return await context.Estanques
                .FromSqlRaw(@"
            SELECT 
                gid, 
                name, 
                folderpath, 
                popupinfo, 
                COALESCE(shape_leng::numeric, 0) AS shape_leng,
                COALESCE(shape_area::numeric, 0) AS shape_area, 
                ST_AsText(geom) AS geom
            FROM capas_geo.estanques_15000
            ORDER BY gid
            OFFSET {0} ROWS 
            FETCH NEXT {1} ROWS ONLY",
                    (pagina - 1) * tamañoPagina,
                    tamañoPagina)
                .AsNoTracking()
                .ToListAsync();
        }
    }
}
