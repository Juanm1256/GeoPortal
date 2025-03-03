using AppGeoPortal.Contexto;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Modelos.Maps;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace GeoPortalTests.Implementacion.Maps
{
    public class CuencasLogicTests
    {
        private readonly AppDbContext _context;
        private readonly CuencasLogic _cuencasLogic;

        public CuencasLogicTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_Cuencas")
                .Options;

            _context = new AppDbContext(options);
            _cuencasLogic = new CuencasLogic(_context);

            _context.Cuencas.AddRange(new List<Cuencas>
            {
                new Cuencas { gid = 1, sup_km2 = 450.5, cuenca = "Cuenca A", geom = "GEOM_A" },
                new Cuencas { gid = 2, sup_km2 = 250.2, cuenca = "Cuenca B", geom = "GEOM_B" }
            });
            _context.SaveChanges();
        }

        [Fact]
        public async Task ListarTodos_ReturnsAllCuencas()
        {
            var result = await _cuencasLogic.ListarTodos();

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            _context.Cuencas.RemoveRange(_context.Cuencas);
            await _context.SaveChangesAsync();

            var result = await _cuencasLogic.ListarTodos();

            Assert.Empty(result);
        }
    }
}
