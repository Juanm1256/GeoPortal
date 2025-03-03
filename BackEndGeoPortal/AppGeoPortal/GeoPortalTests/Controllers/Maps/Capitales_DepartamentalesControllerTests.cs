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
    public class Capitales_DepartamentalesControllerTests
    {
        private readonly Mock<ICap_DepContrato> _mockService;
        private readonly Capitales_DepartamentalesController _controller;

        public Capitales_DepartamentalesControllerTests()
        {
            _mockService = new Mock<ICap_DepContrato>();
            _controller = new Capitales_DepartamentalesController(_mockService.Object);
        }

        [Fact]
        public async Task ListarTodos_ReturnsOkResult_WithListOfCapitales()
        {
            var capitales = new List<Cap_Dep>
            {
                new Cap_Dep { gid = 1, objectid = 1001, cap_dep = "Capital 1", cod_ine = "001", geom = "{}" },
                new Cap_Dep { gid = 2, objectid = 1002, cap_dep = "Capital 2", cod_ine = "002", geom = "{}" }
            };
            _mockService.Setup(service => service.ListarTodos()).ReturnsAsync(capitales);

            var result = await _controller.ListarTodos();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedList = Assert.IsType<List<Cap_Dep>>(okResult.Value);
            Assert.Equal(2, returnedList.Count);
        }

        [Fact]
        public async Task ListarTodos_Returns500_WhenExceptionOccurs()
        {
            _mockService.Setup(service => service.ListarTodos()).ThrowsAsync(new System.Exception("Database error"));

            var result = await _controller.ListarTodos();

            var objectResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, objectResult.StatusCode);
            Assert.Contains("Error al obtener los datos", objectResult.Value.ToString());
        }
    }
}
