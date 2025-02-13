using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace AppGeoPortal.Middleware.Implementacion
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IConfiguration _configuration;
        private readonly ILogger<JwtMiddleware> _logger;

        public JwtMiddleware(RequestDelegate next, IConfiguration configuration, ILogger<JwtMiddleware> logger)
        {
            _next = next;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            var token = httpContext.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
            {
                try
                {
                    var tokenHandler = new JwtSecurityTokenHandler();
                    var key = Encoding.ASCII.GetBytes(_configuration["JwtConfig:Key"]);
                    var tokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(key),
                        ValidateIssuer = true, 
                        ValidateAudience = true,
                        ValidIssuer = _configuration["JwtConfig:Issuer"],
                        ValidAudience = _configuration["JwtConfig:Audience"], 
                        ValidateLifetime = true,
                        ClockSkew = TimeSpan.Zero
                    };

                    var claimsPrincipal = tokenHandler.ValidateToken(token, tokenValidationParameters, out _);
                    httpContext.User = claimsPrincipal;
                }
                catch (Exception ex)
                {
                    _logger.LogWarning("Token inválido: " + ex.Message);
                    httpContext.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    await httpContext.Response.WriteAsync("Token inválido");
                    return;
                }
            }

            await _next(httpContext);
        }
    }
}
