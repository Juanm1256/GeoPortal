using Xunit;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppGeoPortal.Contexto;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Modelos.Maps;

namespace GeoPortalTests.Implementacion.Maps
{
    public class MercadosLogicTests
    {
        private readonly AppDbContext _context;
        private readonly MercadosLogic _mercadosLogic;

        public MercadosLogicTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_Mercados")
                .Options;

            _context = new AppDbContext(options);
            _mercadosLogic = new MercadosLogic(_context);

            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            _context.Mercados.AddRange(new List<Mercados>
            {
                new Mercados { gid = 1, nombre = "Mercado Central", municipio = "Municipio A",
                    ciudad = "Ciudad A", departamen = "Departamento A", provincia = "Provincia A", geom = "{}" },

                new Mercados { gid = 2, nombre = "Mercado Popular", municipio = "Municipio B",
                    ciudad = "Ciudad B", departamen = "Departamento B", provincia = "Provincia B", geom = "{}" }
            });

            _context.SaveChanges();
        }

        [Fact]
        public async Task ListarTodos_ReturnsAllMercados()
        {
            var result = await _mercadosLogic.ListarTodos();

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            _context.Mercados.RemoveRange(_context.Mercados);
            await _context.SaveChangesAsync();

            var result = await _mercadosLogic.ListarTodos();

            Assert.Empty(result);
        }
    }
}
