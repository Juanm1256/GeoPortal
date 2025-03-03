using Xunit;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AppGeoPortal.Contexto;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Modelos.Maps;

namespace GeoPortalTests.Implementacion.Maps
{
    public class Cap_DepLogicTests
    {
        private readonly AppDbContext _context;
        private readonly Cap_DepLogic _capDepLogic;

        public Cap_DepLogicTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_CapDep")
                .Options;

            _context = new AppDbContext(options);
            _capDepLogic = new Cap_DepLogic(_context);

            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            _context.Cap_Deps.AddRange(new List<Cap_Dep>
            {
                new Cap_Dep { gid = 1, objectid = 1001, cap_dep = "Capital 1", cod_ine = "001", geom = "{}" },
                new Cap_Dep { gid = 2, objectid = 1002, cap_dep = "Capital 2", cod_ine = "002", geom = "{}" }
            });

            _context.SaveChanges();
        }

        [Fact]
        public async Task ListarTodos_ReturnsAllCapitales()
        {
            var result = await _capDepLogic.ListarTodos();

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            _context.Cap_Deps.RemoveRange(_context.Cap_Deps);
            await _context.SaveChangesAsync();

            var result = await _capDepLogic.ListarTodos();

            Assert.Empty(result);
        }
    }
}
