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
    public class ProveedorAlimentosControllerTests
    {
        private readonly Mock<IProveedorAliContrato> _mockService;
        private readonly ProveedorAlimentosController _controller;

        public ProveedorAlimentosControllerTests()
        {
            _mockService = new Mock<IProveedorAliContrato>();
            _controller = new ProveedorAlimentosController(_mockService.Object);
        }

        [Fact]
        public async Task ListarTodos_ReturnsOkResult_WithListOfProveedorAlimentos()
        {
            // Arrange
            var proveedores = new List<ProveedorAli>
            {
                new ProveedorAli { gid = 1, oid_ = 1001, name = "Proveedor 1", geom = "GEOM_DATA" },
                new ProveedorAli { gid = 2, oid_ = 1002, name = "Proveedor 2", geom = "GEOM_DATA" }
            };
            _mockService.Setup(s => s.ListarTodos()).ReturnsAsync(proveedores);

            // Act
            var result = await _controller.ListarTodos();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedProveedores = Assert.IsType<List<ProveedorAli>>(okResult.Value);
            Assert.Equal(2, returnedProveedores.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            // Arrange
            _mockService.Setup(s => s.ListarTodos()).ReturnsAsync(new List<ProveedorAli>());

            // Act
            var result = await _controller.ListarTodos();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnedProveedores = Assert.IsType<List<ProveedorAli>>(okResult.Value);
            Assert.Empty(returnedProveedores);
        }
    }
}
