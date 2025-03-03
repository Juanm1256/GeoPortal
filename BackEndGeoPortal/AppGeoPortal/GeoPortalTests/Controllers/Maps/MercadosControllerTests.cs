using Xunit;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AppGeoPortal.Controllers;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;

namespace GeoPortalTests.Controllers.Maps
{
    public class MercadosControllerTests
    {
        private readonly Mock<IMercadoContrato> _mockService;
        private readonly MercadosController _controller;

        public MercadosControllerTests()
        {
            _mockService = new Mock<IMercadoContrato>();
            _controller = new MercadosController(_mockService.Object);
        }

        [Fact]
        public async Task ListarTodos_ReturnsOk_WithMercadosList()
        {
            var mercados = new List<Mercados>
            {
                new Mercados { gid = 1, nombre = "Mercado Central", municipio = "Municipio A" },
                new Mercados { gid = 2, nombre = "Mercado Popular", municipio = "Municipio B" }
            };

            _mockService.Setup(service => service.ListarTodos()).ReturnsAsync(mercados);

            var result = await _controller.ListarTodos();

            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedList = Assert.IsType<List<Mercados>>(actionResult.Value);
            Assert.Equal(2, returnedList.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            _mockService.Setup(service => service.ListarTodos()).ReturnsAsync(new List<Mercados>());

            var result = await _controller.ListarTodos();

            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedList = Assert.IsType<List<Mercados>>(actionResult.Value);
            Assert.Empty(returnedList);
        }
    }
}
