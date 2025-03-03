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
    public class ProveedorAlevinesControllerTests
    {
        private readonly Mock<IProveedorAContrato> _mockRepo;
        private readonly ProveedorAlevinesController _controller;

        public ProveedorAlevinesControllerTests()
        {
            _mockRepo = new Mock<IProveedorAContrato>();
            _controller = new ProveedorAlevinesController(_mockRepo.Object);
        }

        [Fact]
        public async Task ListarTodos_ReturnsOkResult_WithListOfProveedorA()
        {
            var proveedores = new List<Proveedor_A>
            {
                new Proveedor_A { gid = 1, name = "Proveedor 1", x = 123.45m, y = 678.90m, geom = "POINT(123.45 678.90)" },
                new Proveedor_A { gid = 2, name = "Proveedor 2", x = 223.45m, y = 778.90m, geom = "POINT(223.45 778.90)" }
            };
            _mockRepo.Setup(repo => repo.ListarTodos()).ReturnsAsync(proveedores);

            var result = await _controller.ListarTodos();

            var actionResult = Assert.IsType<ActionResult<List<Proveedor_A>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnValue = Assert.IsType<List<Proveedor_A>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            _mockRepo.Setup(repo => repo.ListarTodos()).ReturnsAsync(new List<Proveedor_A>());

            var result = await _controller.ListarTodos();

            var actionResult = Assert.IsType<ActionResult<List<Proveedor_A>>>(result);
            var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
            var returnValue = Assert.IsType<List<Proveedor_A>>(okResult.Value);
            Assert.Empty(returnValue);
        }
    }
}
