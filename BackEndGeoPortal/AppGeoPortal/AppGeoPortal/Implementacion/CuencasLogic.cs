using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class CuencasLogic : ICuencasContrato
    {
        private readonly AppDbContext context;
        public CuencasLogic(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<List<Cuencas>> ListarTodos()
        {
            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();

            var query = @"SELECT gid, sup_km2, cuenca, ST_AsGeoJSON(geom) AS geom FROM capas.cuencas";

            var lista = new List<Cuencas>();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = query;

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Cuencas
                        {
                            gid = reader.GetInt32(0),
                            sup_km2 = reader.GetDouble(1),
                            cuenca = reader.GetString(2),
                            geom = reader.GetString(3)
                        });
                    }
                }
            }

            return lista;
        }
    }
}
