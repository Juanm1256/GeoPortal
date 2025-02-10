using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class Limites_DepartamentalesLogic : ILim_DepartContrato
    {
        private readonly AppDbContext context;
        public Limites_DepartamentalesLogic(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<List<Lim_Dep>> ListarTodos()
        {
            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();

            var query = @"SELECT gid, objectid, dep, cod_dep, shape_leng, shape_area, ST_AsGeoJSON(geom) AS geom FROM capas.limites_departamentales";

            var lista = new List<Lim_Dep>();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = query;

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Lim_Dep
                        {
                            gid = reader.GetInt32(0),
                            objectid = reader.GetDouble(1),
                            dep = reader.GetString(2),
                            cod_dep = reader.GetString(3),
                            shape_leng = reader.GetDecimal(4),
                            shape_area = reader.GetDecimal(5),
                            geom = reader.GetString(6),
                        });
                    }
                }
            }

            return lista;
        }
    }
}
