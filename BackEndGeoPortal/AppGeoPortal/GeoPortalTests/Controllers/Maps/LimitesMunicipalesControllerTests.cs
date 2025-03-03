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
    public class LimitesMunicipalesControllerTests
    {
        private readonly Mock<ILim_MunContrato> _mockService;
        private readonly Limites_MunicipalesController _controller;

        public LimitesMunicipalesControllerTests()
        {
            _mockService = new Mock<ILim_MunContrato>();
            _controller = new Limites_MunicipalesController(_mockService.Object);
        }

        [Fact]
        public async Task ListarTodos_ReturnsOk_WithData()
        {
            var mockData = new List<Lim_Mun>
            {
                new Lim_Mun { gid = 1, dep = "Departamento1", prov = "Provincia1", mun = "Municipio1", cod_dep = "01", cod_prov = "001", cod_mun = "0001", shape_leng = 123.45M, shape_area = 678.90M, geom = "GEOMETRY" }
            };
            _mockService.Setup(s => s.ListarTodos()).ReturnsAsync(mockData);

            var result = await _controller.ListarTodos();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var data = Assert.IsType<List<Lim_Mun>>(okResult.Value);
            Assert.Single(data);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            _mockService.Setup(s => s.ListarTodos()).ReturnsAsync(new List<Lim_Mun>());

            var result = await _controller.ListarTodos();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var data = Assert.IsType<List<Lim_Mun>>(okResult.Value);
            Assert.Empty(data);
        }

        [Fact]
        public async Task ListarTodos_Returns500_WhenExceptionOccurs()
        {
            _mockService.Setup(s => s.ListarTodos()).ThrowsAsync(new System.Exception("Test Exception"));

            var result = await _controller.ListarTodos();

            var objectResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, objectResult.StatusCode);
        }
    }
}
