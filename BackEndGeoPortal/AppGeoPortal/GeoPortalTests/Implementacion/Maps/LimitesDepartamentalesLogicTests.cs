using Xunit;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppGeoPortal.Contexto;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Modelos.Maps;

namespace GeoPortalTests.Implementacion.Maps
{
    public class LimitesDepartamentalesLogicTests
    {
        private readonly AppDbContext _context;
        private readonly Limites_DepartamentalesLogic _logic;

        public LimitesDepartamentalesLogicTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_LimitesDepartamentales")
                .Options;

            _context = new AppDbContext(options);
            _logic = new Limites_DepartamentalesLogic(_context);

            _context.Lim_Deps.AddRange(new List<Lim_Dep>
            {
                new Lim_Dep { gid = 1, dep = "Santa Cruz", cod_dep = "07", shape_leng = 123.45m, shape_area = 678.90m, geom = "{}" },
                new Lim_Dep { gid = 2, dep = "La Paz", cod_dep = "02", shape_leng = 98.76m, shape_area = 543.21m, geom = "{}" }
            });
            _context.SaveChanges();
        }

        [Fact]
        public async Task ListarTodos_ReturnsAllLimites()
        {
            var result = await _logic.ListarTodos();

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            _context.Lim_Deps.RemoveRange(_context.Lim_Deps);
            await _context.SaveChangesAsync();

            var result = await _logic.ListarTodos();

            Assert.Empty(result);
        }
    }
}
