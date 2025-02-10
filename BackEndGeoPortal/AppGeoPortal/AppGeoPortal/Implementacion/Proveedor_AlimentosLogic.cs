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
            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();

            var query = @"SELECT gid, oid_, name, ST_AsGeoJSON(geom) AS geom FROM capas.proveedores_alimentos";

            var lista = new List<ProveedorAli>();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = query;

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new ProveedorAli
                        {
                            gid = reader.GetInt32(0),
                            oid_ = reader.GetDouble(1),
                            name = reader.GetString(2),
                            geom = reader.GetString(3),
                        });
                    }
                }
            }

            return lista;
        }
    }
}
