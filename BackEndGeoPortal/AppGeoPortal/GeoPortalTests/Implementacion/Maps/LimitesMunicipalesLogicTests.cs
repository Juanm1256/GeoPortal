using Xunit;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppGeoPortal.Contexto;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Modelos.Maps;

namespace GeoPortalTests.Implementacion.Maps
{
    public class LimitesMunicipalesLogicTests
    {
        private readonly AppDbContext _context;
        private readonly Limites_MunicipalesLogic _limitesMunicipalesLogic;

        public LimitesMunicipalesLogicTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_LimitesMunicipales")
                .Options;

            _context = new AppDbContext(options);
            _limitesMunicipalesLogic = new Limites_MunicipalesLogic(_context);

            _context.Lim_Muns.RemoveRange(_context.Lim_Muns);
            _context.SaveChanges();

            _context.Lim_Muns.AddRange(new List<Lim_Mun>
            {
                new Lim_Mun { dep = "Departamento1", prov = "Provincia1", mun = "Municipio1", cod_dep = "01", cod_prov = "001", cod_mun = "0001", shape_leng = 123.45M, shape_area = 678.90M, geom = "GEOMETRY" },
                new Lim_Mun { dep = "Departamento2", prov = "Provincia2", mun = "Municipio2", cod_dep = "02", cod_prov = "002", cod_mun = "0002", shape_leng = 223.45M, shape_area = 778.90M, geom = "GEOMETRY" }
            });
            _context.SaveChanges();
        }

        [Fact]
        public async Task ListarTodos_ReturnsAllMunicipios()
        {
            var result = await _limitesMunicipalesLogic.ListarTodos();

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            _context.Lim_Muns.RemoveRange(_context.Lim_Muns);
            await _context.SaveChangesAsync();

            var result = await _limitesMunicipalesLogic.ListarTodos();

            Assert.Empty(result);
        }
    }
}
