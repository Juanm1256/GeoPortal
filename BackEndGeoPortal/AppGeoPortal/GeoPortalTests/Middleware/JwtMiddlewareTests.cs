using AppGeoPortal.Middleware.Implementacion;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using Xunit;

namespace GeoPortalTests.Middleware
{
    public class JwtMiddlewareTests
    {
        private readonly Mock<RequestDelegate> _nextMock;
        private readonly Mock<IConfiguration> _configurationMock;
        private readonly Mock<ILogger<JwtMiddleware>> _loggerMock;
        private readonly JwtMiddleware _middleware;
        private readonly DefaultHttpContext _httpContext;

        public JwtMiddlewareTests()
        {
            _nextMock = new Mock<RequestDelegate>();
            _configurationMock = new Mock<IConfiguration>();
            _loggerMock = new Mock<ILogger<JwtMiddleware>>();
            _httpContext = new DefaultHttpContext();

            _configurationMock.Setup(c => c["JwtConfig:Key"]).Returns("mysupersecretkeymysupersecretkey");
            _configurationMock.Setup(c => c["JwtConfig:Issuer"]).Returns("issuer");
            _configurationMock.Setup(c => c["JwtConfig:Audience"]).Returns("audience");

            _middleware = new JwtMiddleware(_nextMock.Object, _configurationMock.Object, _loggerMock.Object);
        }

        [Fact]
        public async Task InvokeAsync_ValidToken_SetsUserInContext()
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configurationMock.Object["JwtConfig:Key"]);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[] { new Claim(ClaimTypes.Name, "testuser") }),
                Expires = System.DateTime.UtcNow.AddMinutes(5),
                Issuer = _configurationMock.Object["JwtConfig:Issuer"],
                Audience = _configurationMock.Object["JwtConfig:Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            _httpContext.Request.Headers["Authorization"] = "Bearer " + tokenString;

            await _middleware.InvokeAsync(_httpContext);

            Assert.NotNull(_httpContext.User.Identity);
            Assert.True(_httpContext.User.Identity.IsAuthenticated);
            Assert.Equal("testuser", _httpContext.User.Identity.Name);
        }

        [Fact]
        public async Task InvokeAsync_InvalidToken_ReturnsUnauthorized()
        {
            _httpContext.Request.Headers["Authorization"] = "Bearer invalid_token";

            await _middleware.InvokeAsync(_httpContext);

            Assert.Equal(StatusCodes.Status401Unauthorized, _httpContext.Response.StatusCode);
        }
    }
}
