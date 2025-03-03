using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using AppGeoPortal.Controllers;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos;
using AppGeoPortal.Modelos.DTO;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GeoPortalControllerTests
{
    public class RolPermisoControllerTests
    {
        private readonly Mock<IRol_PermisoContrato> _mockService;
        private readonly Rol_PermisoController _controller;

        public RolPermisoControllerTests()
        {
            _mockService = new Mock<IRol_PermisoContrato>();
            _controller = new Rol_PermisoController(_mockService.Object);
        }

        [Fact]
        public async Task ListarTodos_ReturnsAllRolPermisos()
        {
            var rolesPermisos = new List<Rol_Permiso>
        {
            new Rol_Permiso { idrolpermiso = 1, idrol = 1, idpermiso = 1, estado = "Activo" },
            new Rol_Permiso { idrolpermiso = 2, idrol = 2, idpermiso = 2, estado = "Inactivo" }
        };

            _mockService.Setup(service => service.ListarTodos()).ReturnsAsync(rolesPermisos);

            var result = await _controller.ListarTodos();

            var actionResult = Assert.IsType<ActionResult<List<Rol_Permiso>>>(result);
            var returnValue = Assert.IsType<OkObjectResult>(actionResult.Result);
            var model = Assert.IsType<List<Rol_Permiso>>(returnValue.Value);
            Assert.Equal(2, model.Count);
        }

        [Fact]
        public async Task ListarActivos_ReturnsOnlyActiveRolPermisos()
        {
            var rolesPermisos = new List<Rol_Permiso>
        {
            new Rol_Permiso { idrolpermiso = 1, idrol = 1, idpermiso = 1, estado = "Activo" }
        };

            _mockService.Setup(service => service.ListarActivos()).ReturnsAsync(rolesPermisos);

            var result = await _controller.ListarActivos();

            var actionResult = Assert.IsType<ActionResult<List<Rol_Permiso>>>(result);
            var returnValue = Assert.IsType<OkObjectResult>(actionResult.Result);
            var model = Assert.IsType<List<Rol_Permiso>>(returnValue.Value);
            Assert.Single(model);
        }

        [Fact]
        public async Task Insertar_AddsNewRolPermiso()
        {
            var newRolPermiso = new Rol_PermisoDTO
            {
                nombreRol = "Admin",
                estado = "Activo",
                IdPermisos = new List<int> { 1, 2 }
            };

            _mockService.Setup(service => service.Insertar(newRolPermiso)).ReturnsAsync(true);

            var result = await _controller.Insertar(newRolPermiso);

            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(_controller.ListarTodos), actionResult.ActionName);
        }

        [Fact]
        public async Task Modificar_UpdatesRolPermiso()
        {
            var rolPermisoUpdate = new Rol_PermisoDTO
            {
                nombreRol = "User",
                estado = "Inactivo",
                IdPermisos = new List<int> { 2 }
            };

            _mockService.Setup(service => service.Modificar(rolPermisoUpdate, "User")).ReturnsAsync(true);

            var result = await _controller.Modificar(rolPermisoUpdate, "User");

            var actionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal(nameof(_controller.ListarTodos), actionResult.ActionName);
        }
    }
}
