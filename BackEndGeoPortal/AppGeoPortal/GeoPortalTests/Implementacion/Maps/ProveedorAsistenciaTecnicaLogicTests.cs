using Xunit;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppGeoPortal.Contexto;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Modelos.Maps;

namespace GeoPortalTests.Implementacion.Maps
{
    public class ProveedorAsistenciaTecnicaLogicTests
    {
        private readonly AppDbContext _context;
        private readonly Proveedor_AsistTecLogic _logic;

        public ProveedorAsistenciaTecnicaLogicTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_ProveedorAsistencia")
                .Options;

            _context = new AppDbContext(options);
            _logic = new Proveedor_AsistTecLogic(_context);

            _context.ProveedorAsistenciaTecnica.RemoveRange(_context.ProveedorAsistenciaTecnica);
            _context.ProveedorAsistenciaTecnica.AddRange(new List<ProveedorAsisTec>
            {
                new ProveedorAsisTec { gid = 1, name = "Proveedor 1", long_x = -64.0M, lat_y = -17.0M, geom = "{}" },
                new ProveedorAsisTec { gid = 2, name = "Proveedor 2", long_x = -65.0M, lat_y = -18.0M, geom = "{}" }
            });
            _context.SaveChanges();
        }

        [Fact]
        public async Task ListarTodos_ReturnsAllProveedores()
        {
            var result = await _logic.ListarTodos();

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            _context.ProveedorAsistenciaTecnica.RemoveRange(_context.ProveedorAsistenciaTecnica);
            await _context.SaveChangesAsync();

            var result = await _logic.ListarTodos();

            Assert.Empty(result);
        }
    }
}
