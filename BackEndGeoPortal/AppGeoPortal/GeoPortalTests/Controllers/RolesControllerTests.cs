using Xunit;
using Moq;
using AppGeoPortal.Controllers;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos;
using AppGeoPortal.Modelos.DTO;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GeoPortalControllerTests
{
    public class RolesControllerTests
    {
        private readonly Mock<IRolesContrato> _rolesMock;
        private readonly RolesController _controller;

        public RolesControllerTests()
        {
            _rolesMock = new Mock<IRolesContrato>();
            _controller = new RolesController(_rolesMock.Object);
        }

        [Fact]
        public async Task ListarTodos_ReturnsRolesList()
        {
            // Arrange
            var rolesLista = new List<RolesDTO>
        {
            new RolesDTO { idrol = 1, nombre = "Admin", estado = "Activo", permisos = new List<string> { "Ver", "Editar" } },
            new RolesDTO { idrol = 2, nombre = "Usuario", estado = "Activo", permisos = new List<string> { "Ver" } }
        };

            _rolesMock.Setup(repo => repo.ListarTodos()).ReturnsAsync(rolesLista);

            // Act
            var result = await _controller.ListarTodos();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<RolesDTO>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task ListarPermisos_ReturnsPermisosList()
        {
            // Arrange
            var permisosLista = new List<Permisos>
        {
            new Permisos { idpermiso = 1, nombre = "Ver" },
            new Permisos { idpermiso = 2, nombre = "Editar" }
        };

            _rolesMock.Setup(repo => repo.ListarPermisos()).ReturnsAsync(permisosLista);

            // Act
            var result = await _controller.ListarPermisos();

            // Assert
            var actionResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<Permisos>>(actionResult.Value);
            Assert.Equal(2, returnValue.Count);
        }
    }
}