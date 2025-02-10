using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class Cap_DepLogic : ICap_DepContrato
    {
        private readonly AppDbContext context;
        public Cap_DepLogic(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<List<Cap_Dep>> ListarTodos()
        {
            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();

        var query = @"SELECT gid, objectid, cap_dep, cod_ine, ST_AsGeoJSON(geom) AS geom FROM capas.capitales_departamentales";

            var lista = new List<Cap_Dep>();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = query;

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Cap_Dep
                        {
                            gid = reader.GetInt32(0),
                            objectid = reader.GetDouble(1),
                            cap_dep = reader.GetString(2),
                            cod_ine = reader.GetString(3),
                            geom = reader.GetString(4)
                        });
                    }
                }
            }

            return lista;
        }
    }
}
