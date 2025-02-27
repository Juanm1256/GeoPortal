using Xunit;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppGeoPortal.Contexto;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Modelos.Maps;

namespace GeoPortalTests.Implementacion.Maps
{
    public class ProveedorAlevinesLogicTests
    {
        private readonly AppDbContext _context;
        private readonly Proveedor_AlevinesLogic _logic;

        public ProveedorAlevinesLogicTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_ProveedorAlevines")
                .Options;

            _context = new AppDbContext(options);
            _logic = new Proveedor_AlevinesLogic(_context);

            // 🛑 Eliminar datos previos antes de cada prueba
            _context.ProveedorAlevies.RemoveRange(_context.ProveedorAlevies);
            _context.SaveChanges();

            // ✅ Insertar datos sin definir manualmente `gid`
            _context.ProveedorAlevies.AddRange(new List<Proveedor_A>
            {
                new Proveedor_A { name = "Proveedor 1", x = 123.45m, y = 678.90m, geom = "POINT(123.45 678.90)" },
                new Proveedor_A { name = "Proveedor 2", x = 223.45m, y = 778.90m, geom = "POINT(223.45 778.90)" }
            });
            _context.SaveChanges();
        }

        [Fact]
        public async Task ListarTodos_ReturnsAllProveedores()
        {
            // Act
            var result = await _logic.ListarTodos();

            // Assert
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            // 🛑 Eliminar datos antes de la prueba
            _context.ProveedorAlevies.RemoveRange(_context.ProveedorAlevies);
            await _context.SaveChangesAsync();

            // Act
            var result = await _logic.ListarTodos();

            // Assert
            Assert.Empty(result);
        }
    }
}
