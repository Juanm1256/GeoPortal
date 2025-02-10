using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class Limites_MunicipalesLogic : ILim_MunContrato
    {
        private readonly AppDbContext context;
        public Limites_MunicipalesLogic(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<List<Lim_Mun>> ListarTodos()
        {
            var connection = context.Database.GetDbConnection();
            await connection.OpenAsync();

            var query = @"SELECT gid, objectid, dep, prov, mun, cod_dep, cod_prov, cod_mun, shape_leng, shape_area, ST_AsGeoJSON(geom) AS geom FROM capas.limites_municipales";

            var lista = new List<Lim_Mun>();

            using (var command = connection.CreateCommand())
            {
                command.CommandText = query;

                using (var reader = await command.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Lim_Mun
                        {
                            gid = reader.GetInt32(0),
                            objectid = reader.GetDouble(1),
                            dep = reader.GetString(2),
                            prov = reader.GetString(3),
                            mun = reader.GetString(4),
                            cod_dep = reader.GetString(5),
                            cod_prov = reader.GetString(6),
                            cod_mun = reader.GetString(7),
                            shape_leng = reader.GetDecimal(8),
                            shape_area = reader.GetDecimal(9),
                            geom = reader.GetString(10),
                        });
                    }
                }
            }

            return lista;
        }
    }
}
