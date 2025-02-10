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
            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();

            var query = @"SELECT gid, name, x, y, ST_AsGeoJSON(geom) AS geom FROM capas.proveedores_alevines";

            var lista = new List<Proveedor_A>();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = query;

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Proveedor_A
                        {
                            gid = reader.GetInt32(0),
                            name = reader.GetString(1),
                            x = reader.GetDecimal(2),
                            y = reader.GetDecimal(3),
                            geom = reader.GetString(4),
                        });
                    }
                }
            }

            return lista;
        }
    }
}
