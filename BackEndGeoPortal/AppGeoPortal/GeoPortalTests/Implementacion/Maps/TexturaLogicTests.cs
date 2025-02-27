using Xunit;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppGeoPortal.Contexto;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Modelos.DTO;
using AppGeoPortal.Modelos.Maps;

namespace GeoPortalTests.Implementacion.Maps
{
    public class TexturaLogicTests
    {
        private readonly AppDbContext _context;
        private readonly TexturaLogic _texturaLogic;

        public TexturaLogicTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDb")
                .Options;
            _context = new AppDbContext(options);
            _texturaLogic = new TexturaLogic(_context);
        }

        [Fact]
        public async Task ListarTexturasuelocero_ReturnsList_WithData()
        {
            // Arrange
            _context.Texturas.AddRange(new List<Textura>
            {
                new Textura { Value = 1, Porcentaje = 30.5 },
                new Textura { Value = 2, Porcentaje = 45.2 }
            });
            await _context.SaveChangesAsync();


            // Act
            var result = await _texturaLogic.ListarTexturasuelocero();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task ListarTexturasuelocero_ReturnsEmptyList_WhenNoData()
        {
            // Act
            var result = await _texturaLogic.ListarTexturasuelocero();

            // Assert
            Assert.NotNull(result);
            Assert.Empty(result);
        }
    }
}
