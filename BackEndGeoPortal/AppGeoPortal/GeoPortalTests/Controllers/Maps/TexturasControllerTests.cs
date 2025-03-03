using Xunit;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AppGeoPortal.Controllers;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.DTO;

namespace GeoPortalTests.Controllers.Maps
{
    public class TexturasControllerTests
    {
        private readonly Mock<ITexturaContrato> _mockTexturaContrato;
        private readonly TexturasController _controller;

        public TexturasControllerTests()
        {
            _mockTexturaContrato = new Mock<ITexturaContrato>();
            _controller = new TexturasController(_mockTexturaContrato.Object);
        }

        [Fact]
        public async Task ListarTexturasuelocero_ReturnsOkResult_WithData()
        {
            var mockData = new List<TexturaDTO>
            {
                new TexturaDTO { Value = 1, Porcentaje = 25.3 },
                new TexturaDTO { Value = 2, Porcentaje = 40.7 }
            };
            _mockTexturaContrato.Setup(repo => repo.ListarTexturasuelocero()).ReturnsAsync(mockData);

            var result = await _controller.ListarTexturasuelocero();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<TexturaDTO>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task ListarTexturasuelocero_ReturnsEmptyList_WhenNoData()
        {
            _mockTexturaContrato.Setup(repo => repo.ListarTexturasuelocero()).ReturnsAsync(new List<TexturaDTO>());

            var result = await _controller.ListarTexturasuelocero();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<TexturaDTO>>(okResult.Value);
            Assert.Empty(returnValue);
        }

        [Fact]
        public async Task ListarTexturasuelocero_ReturnsInternalServerError_OnException()
        {
            _mockTexturaContrato.Setup(repo => repo.ListarTexturasuelocero()).ThrowsAsync(new System.Exception("Database Error"));

            var result = await _controller.ListarTexturasuelocero();

            var statusCodeResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, statusCodeResult.StatusCode);
        }
    }
}
