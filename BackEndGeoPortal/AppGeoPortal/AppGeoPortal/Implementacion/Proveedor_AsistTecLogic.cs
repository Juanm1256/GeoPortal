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
            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();

            var query = @"SELECT gid, name, long_x, lat_y, ST_AsGeoJSON(geom) AS geom FROM capas.proveedores_asistencia_tecnica";

            var lista = new List<ProveedorAsisTec>();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = query;

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new ProveedorAsisTec
                        {
                            gid = reader.GetInt32(0),
                            name = reader.IsDBNull(reader.GetOrdinal("name")) ? null : reader.GetString(reader.GetOrdinal("name")),
                            long_x = reader.GetDecimal(2),
                            lat_y = reader.GetDecimal(3),
                            geom = reader.GetString(4)
                        });
                    }
                }
            }

            return lista;
        }
    }
}
