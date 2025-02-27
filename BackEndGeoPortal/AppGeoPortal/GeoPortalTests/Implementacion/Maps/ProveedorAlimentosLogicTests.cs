using Xunit;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppGeoPortal.Contexto;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Modelos.Maps;

namespace GeoPortalTests.Implementacion.Maps
{
    public class ProveedorAlimentosLogicTests
    {
        private readonly AppDbContext _context;
        private readonly Proveedor_AlimentosLogic _logic;

        public ProveedorAlimentosLogicTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_ProveedorAlimentos")
                .Options;

            _context = new AppDbContext(options);
            _logic = new Proveedor_AlimentosLogic(_context);

            // Insertar datos de prueba
            _context.ProveedorAlimentos.RemoveRange(_context.ProveedorAlimentos);
            _context.ProveedorAlimentos.AddRange(new List<ProveedorAli>
            {
                new ProveedorAli { gid = 1, oid_ = 1001, name = "Proveedor 1", geom = "GEOM_DATA" },
                new ProveedorAli { gid = 2, oid_ = 1002, name = "Proveedor 2", geom = "GEOM_DATA" }
            });
            _context.SaveChanges();
        }

        [Fact]
        public async Task ListarTodos_ReturnsAllProveedorAlimentos()
        {
            // Act
            var result = await _logic.ListarTodos();

            // Assert
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            // Arrange
            _context.ProveedorAlimentos.RemoveRange(_context.ProveedorAlimentos);
            await _context.SaveChangesAsync();

            // Act
            var result = await _logic.ListarTodos();

            // Assert
            Assert.Empty(result);
        }
    }
}
