using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class MercadosLogic : IMercadoContrato
    {
        private readonly AppDbContext context;
        public MercadosLogic(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<List<Mercados>> ListarTodos()
        {
            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();

            var query = @"SELECT gid, ogc_fid, departamen, provincia, municipio, ciudad, nombre, ST_AsGeoJSON(geom) AS geom FROM capas.mercados_project";

            var lista = new List<Mercados>();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = query;

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Mercados
                        {
                            gid = reader.GetInt32(0),
                            ogc_fid = reader.GetDouble(1),
                            departamen = reader.GetString(2),
                            provincia = reader.GetString(3),
                            municipio = reader.GetString(4),
                            ciudad = reader.GetString(5),
                            nombre = reader.GetString(6),
                            geom = reader.GetString(7),
                        });
                    }
                }
            }

            return lista;
        }
    }
}
