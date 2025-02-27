using AppGeoPortal.Contrato;
using AppGeoPortal.Controllers;
using AppGeoPortal.Modelos.Maps;
using Microsoft.AspNetCore.Mvc;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace GeoPortalTests.Controllers.Maps
{
    public class CuencasControllerTests
    {
        private readonly Mock<ICuencasContrato> _mockCuencasContrato;
        private readonly CuencasController _controller;

        public CuencasControllerTests()
        {
            _mockCuencasContrato = new Mock<ICuencasContrato>();
            _controller = new CuencasController(_mockCuencasContrato.Object);
        }

        [Fact]
        public async Task ListarTodos_ReturnsOkResult_WithListOfCuencas()
        {
            // Arrange
            var cuencasList = new List<Cuencas>
            {
                new Cuencas { gid = 1, sup_km2 = 500.5, cuenca = "Cuenca 1", geom = "GEOM1" },
                new Cuencas { gid = 2, sup_km2 = 300.3, cuenca = "Cuenca 2", geom = "GEOM2" }
            };
            _mockCuencasContrato.Setup(repo => repo.ListarTodos()).ReturnsAsync(cuencasList);

            // Act
            var result = await _controller.ListarTodos();

            // Assert
            var actionResult = Assert.IsType<ActionResult<List<Cuencas>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnValue = Assert.IsType<List<Cuencas>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task ListarTodos_Returns500_WhenExceptionThrown()
        {
            // Arrange
            _mockCuencasContrato.Setup(repo => repo.ListarTodos()).ThrowsAsync(new System.Exception("Database error"));

            // Act
            var result = await _controller.ListarTodos();

            // Assert
            var actionResult = Assert.IsType<ActionResult<List<Cuencas>>>(result);
            var objectResult = Assert.IsType<ObjectResult>(actionResult.Result);
            Assert.Equal(500, objectResult.StatusCode);
        }
    }
}
