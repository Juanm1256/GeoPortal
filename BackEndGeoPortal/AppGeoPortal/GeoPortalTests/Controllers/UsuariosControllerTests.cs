using Xunit;
using Moq;
using AppGeoPortal.Controllers;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace GeoPortalControllerTests
{
    public class UsuariosControllerTests
    {
        private readonly Mock<IUsuariosContrato> _mockUsuarioContrato;
        private readonly UsuariosController _controller;

        public UsuariosControllerTests()
        {
            _mockUsuarioContrato = new Mock<IUsuariosContrato>();
            _controller = new UsuariosController(_mockUsuarioContrato.Object);
        }

        [Fact]
        public async Task ListarTodos_ReturnsOk_WithListOfUsuarios()
        {
            var usuariosList = new List<Usuarios>
        {
            new Usuarios { idusuario = 1, username = "user1", estado = "Activo" },
            new Usuarios { idusuario = 2, username = "user2", estado = "Inactivo" }
        };
            _mockUsuarioContrato.Setup(x => x.ListarTodos()).ReturnsAsync(usuariosList);

            var result = await _controller.ListarTodos();

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<List<Usuarios>>(okResult.Value);
            Assert.Equal(2, returnValue.Count);
        }

        [Fact]
        public async Task ObtenerId_ReturnsOk_WithUsuario()
        {
            var usuario = new Usuarios { idusuario = 1, username = "user1", estado = "Activo" };
            _mockUsuarioContrato.Setup(x => x.ObtenerById(1)).ReturnsAsync(usuario);

            var result = await _controller.ObtenerId(1);

            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var returnValue = Assert.IsType<Usuarios>(okResult.Value);
            Assert.Equal(1, returnValue.idusuario);
        }

        [Fact]
        public async Task Insertar_ReturnsCreatedAtAction_WhenSuccessful()
        {
            var usuario = new Usuarios { idusuario = 3, username = "newuser", estado = "Activo" };
            _mockUsuarioContrato.Setup(x => x.Insertar(usuario)).ReturnsAsync(true);

            var result = await _controller.Insertar(usuario);

            var createdAtActionResult = Assert.IsType<CreatedAtActionResult>(result);
            Assert.Equal("ListarTodos", createdAtActionResult.ActionName);
        }

        [Fact]
        public async Task Modificar_ReturnsBadRequest_WhenFailed()
        {
            var usuario = new Usuarios { idusuario = 3, username = "updatedUser", estado = "Activo" };
            _mockUsuarioContrato.Setup(x => x.Modificar(usuario, 3)).ReturnsAsync(false);

            var result = await _controller.Modificar(usuario, 3);

            var badRequestResult = Assert.IsType<BadRequestObjectResult>(result);
            Assert.Equal("No se pudo modificar el usuario", badRequestResult.Value);
        }

        [Fact]
        public async Task Eliminar_ReturnsOk_WhenSuccessful()
        {
            _mockUsuarioContrato.Setup(x => x.Delete(1)).ReturnsAsync(true);

            var result = await _controller.Eliminar(1);

            Assert.IsType<OkResult>(result);
        }
    }
}