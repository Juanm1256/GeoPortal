using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using AppGeoPortal.Controllers;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;

namespace GeoPortalTests.Controllers.Maps
{
    public class LimitesDepartamentalesControllerTests
    {
        private readonly Mock<ILim_DepartContrato> _mockRepo;
        private readonly Limites_DepartamentalesController _controller;

        public LimitesDepartamentalesControllerTests()
        {
            _mockRepo = new Mock<ILim_DepartContrato>();
            _controller = new Limites_DepartamentalesController(_mockRepo.Object);
        }

        [Fact]
        public async Task ListarTodos_ReturnsOk_WithData()
        {
            // Arrange
            var limites = new List<Lim_Dep>
            {
                new Lim_Dep { gid = 1, dep = "Santa Cruz", cod_dep = "07", shape_leng = 123.45m, shape_area = 678.90m, geom = "{}" },
                new Lim_Dep { gid = 2, dep = "La Paz", cod_dep = "02", shape_leng = 98.76m, shape_area = 543.21m, geom = "{}" }
            };

            _mockRepo.Setup(repo => repo.ListarTodos()).ReturnsAsync(limites);

            // Act
            var result = await _controller.ListarTodos();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<Lim_Dep>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task ListarTodos_ReturnsEmptyList_WhenNoData()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.ListarTodos()).ReturnsAsync(new List<Lim_Dep>());

            // Act
            var result = await _controller.ListarTodos();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<Lim_Dep>>(actionResult.Value);
            Assert.Empty(returnValue);
        }

        [Fact]
        public async Task ListarTodos_Returns500_WhenExceptionOccurs()
        {
            // Arrange
            _mockRepo.Setup(repo => repo.ListarTodos()).ThrowsAsync(new System.Exception("Database error"));

            // Act
            var result = await _controller.ListarTodos();

            // Assert
            var actionResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, actionResult.StatusCode);
        }
    }
}
