using Xunit;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AppGeoPortal.Contrato;
using AppGeoPortal.Controllers;
using AppGeoPortal.Modelos.Maps;

namespace GeoPortalTests.Controllers.Maps
{
    public class ProveedorAsistenciaTecnicaControllerTests
    {
        private readonly Mock<IProveedorAsisTecContrato> _mockService;
        private readonly ProveedorAsistenciaTecnicaController _controller;

        public ProveedorAsistenciaTecnicaControllerTests()
        {
            _mockService = new Mock<IProveedorAsisTecContrato>();
            _controller = new ProveedorAsistenciaTecnicaController(_mockService.Object);
        }

        [Fact]
        public async Task ListarTodos_ReturnsOkResult_WithData()
        {
            // Arrange
            var proveedores = new List<ProveedorAsisTec>
            {
                new ProveedorAsisTec { gid = 1, name = "Proveedor 1", long_x = -64.0M, lat_y = -17.0M, geom = "{}" },
                new ProveedorAsisTec { gid = 2, name = "Proveedor 2", long_x = -65.0M, lat_y = -18.0M, geom = "{}" }
            };

            _mockService.Setup(s => s.ListarTodos()).ReturnsAsync(proveedores);

            // Act
            var result = await _controller.ListarTodos();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<ProveedorAsisTec>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            // Arrange
            _mockService.Setup(s => s.ListarTodos()).ReturnsAsync(new List<ProveedorAsisTec>());

            // Act
            var result = await _controller.ListarTodos();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<ProveedorAsisTec>>(okResult.Value);
            Assert.Empty(returnValue);
        }

        [Fact]
        public async Task ListarTodos_Returns500_WhenExceptionThrown()
        {
            // Arrange
            _mockService.Setup(s => s.ListarTodos()).ThrowsAsync(new System.Exception("Database error"));

            // Act
            var result = await _controller.ListarTodos();

            // Assert
            var statusCodeResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusCodeResult.StatusCode);
        }
    }
}
