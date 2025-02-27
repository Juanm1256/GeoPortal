using AppGeoPortal.Middleware.Atributes;
using AppGeoPortal.Middleware.Implementacion;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Logging;
using Moq;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace GeoPortalTests.Middleware
{
    public class PermisosMiddlewareTests
    {
        private readonly Mock<RequestDelegate> _nextMock;
        private readonly Mock<ILogger<PermisosMiddleware>> _loggerMock;
        private readonly DefaultHttpContext _httpContext;
        private readonly PermisosMiddleware _middleware;

        public PermisosMiddlewareTests()
        {
            _nextMock = new Mock<RequestDelegate>();
            _loggerMock = new Mock<ILogger<PermisosMiddleware>>();

            _middleware = new PermisosMiddleware(_nextMock.Object, _loggerMock.Object);
            _httpContext = new DefaultHttpContext();
            _httpContext.Response.Body = new MemoryStream(); // Para leer el response

            // Simular un endpoint protegido con metadatos de permiso
            var endpoint = new Endpoint(
                (context) => Task.CompletedTask,
                new EndpointMetadataCollection(new PermisoRequeridoAttribute("Ver")),
                "TestEndpoint"
            );

            _httpContext.SetEndpoint(endpoint);
        }

        [Fact]
        public async Task Invoke_UnauthenticatedUser_DeniesRequest()
        {
            // Arrange: Usuario no autenticado
            _httpContext.Request.Path = "/api/protegido";
            _httpContext.User = new ClaimsPrincipal(); // Sin autenticación

            // Act
            await _middleware.Invoke(_httpContext);

            // Assert
            Assert.Equal(StatusCodes.Status401Unauthorized, _httpContext.Response.StatusCode);

            // Leer el mensaje de error
            _httpContext.Response.Body.Seek(0, SeekOrigin.Begin);
            var reader = new StreamReader(_httpContext.Response.Body, Encoding.UTF8);
            var responseMessage = await reader.ReadToEndAsync();

            Assert.Equal("Usuario no autenticado.", responseMessage.Trim());
            _nextMock.Verify(m => m(It.IsAny<HttpContext>()), Times.Never); // Asegurar que el middleware detuvo la ejecución
        }

        [Fact]
        public async Task Invoke_AuthenticatedUser_AllowsRequest()
        {
            // Arrange: Usuario autenticado **con el permiso correcto**
            _httpContext.Request.Path = "/api/protegido";
            _httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim(ClaimTypes.Name, "UsuarioPrueba"),
                new Claim("Permiso", "Ver") // Agregado el permiso correcto
            }, "mock"));

            // Act
            await _middleware.Invoke(_httpContext);

            // Assert
            Assert.Equal(StatusCodes.Status200OK, _httpContext.Response.StatusCode);
            _nextMock.Verify(m => m(It.IsAny<HttpContext>()), Times.Once); // Debe pasar la solicitud al siguiente middleware
        }
    }
}
