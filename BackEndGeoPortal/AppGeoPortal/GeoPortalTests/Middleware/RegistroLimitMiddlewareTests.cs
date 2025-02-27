using AppGeoPortal.Contexto;
using AppGeoPortal.Middleware.Implementacion;
using AppGeoPortal.Modelos;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.IO;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Xunit;

namespace GeoPortalTests.Middleware
{
    public class RegistroLimitMiddlewareTests
    {
        private readonly Mock<RequestDelegate> _nextMock;
        private readonly DefaultHttpContext _httpContext;
        private readonly AppDbContext _dbContext;
        private readonly IServiceProvider _serviceProvider;

        public RegistroLimitMiddlewareTests()
        {
            _nextMock = new Mock<RequestDelegate>();

            var services = new ServiceCollection();
            services.AddDbContext<AppDbContext>(options =>
                options.UseInMemoryDatabase("TestDb"));

            // Mock de IConfiguration con un valor de configuración ficticio
            var configurationMock = new Mock<IConfiguration>();
            configurationMock.Setup(c => c["JwtConfig:Issuer"]).Returns("TestIssuer");
            configurationMock.Setup(c => c["JwtConfig:Audience"]).Returns("TestAudience");
            configurationMock.Setup(c => c["JwtConfig:Key"]).Returns("SuperSecretTestKey");

            services.AddSingleton<IConfiguration>(configurationMock.Object);
            services.AddLogging(); // Para evitar errores de ILogger

            _serviceProvider = services.BuildServiceProvider();
            _dbContext = _serviceProvider.GetRequiredService<AppDbContext>();

            _httpContext = new DefaultHttpContext
            {
                RequestServices = _serviceProvider,
                Response = { Body = new MemoryStream() } // Para leer el response
            };

            _httpContext.User = new ClaimsPrincipal(new ClaimsIdentity(new[]
            {
                new Claim("idusuario", "1")
            }, "mock"));
        }


        [Fact]
        public async Task InvokeAsync_UserWithinLimit_AllowsRequest()
        {
            var middleware = new RegistroLimitMiddleware(_nextMock.Object, _serviceProvider.GetRequiredService<IServiceScopeFactory>());

            _httpContext.Request.Method = "GET";
            _httpContext.Request.Path = "/api/Usuarios/ListarTodos";

            await middleware.InvokeAsync(_httpContext);

            Assert.Equal(StatusCodes.Status200OK, _httpContext.Response.StatusCode);
            _nextMock.Verify(m => m(It.IsAny<HttpContext>()), Times.Once);
        }
    }
}
