using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AppGeoPortal.Contexto;
using AppGeoPortal.Middleware.Contrato;
using AppGeoPortal.Middleware.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

namespace AppGeoPortal.Middleware.Implementacion
{
    public class JwtService : IJwtContrato
    {
        private readonly AppDbContext context;
        private readonly IConfiguration configuration;
        private readonly ILogger<JwtService> _logger;

        public JwtService(AppDbContext context, IConfiguration configuration, ILogger<JwtService> logger)
        {
            this.context = context;
            this.configuration = configuration;
            _logger = logger;
        }

        public async Task<LoginResponseModel?> Authenticate(LoginRequestModel request)
        {
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return null;
            }

            var userAccount = await context.Usuarios
                .Include(u => u.IdRolnav)
                .ThenInclude(r => r.RolPermisos)
                .ThenInclude(rp => rp.IdPermisonav).FirstOrDefaultAsync(x => x.username == request.Username);
            if (userAccount is null || !PasswordHashHandler.VerifyPassword(request.Password, userAccount.password_hash))
            {
                return null;
            }

            if (userAccount.estado != "Activo")
            {
                _logger.LogWarning($"Intento de acceso de usuario inactivo: {request.Username}");
                return null;
            }

            // Validación del estado del rol
            if (userAccount.IdRolnav.estado != "Activo")
            {
                _logger.LogWarning($"Intento de acceso con rol inactivo. Usuario: {request.Username}, Rol: {userAccount.IdRolnav.nombre}");
                return null;
            }

            var issuer = configuration["JwtConfig:Issuer"];
            var audience = configuration["JwtConfig:Audience"];
            var key = configuration["JwtCOnfig:Key"];
            var tokenVlidityMins = configuration.GetValue<int>("JwtConfig:TokenValidityMins");
            var tokenExpiryTimeStamp = DateTime.UtcNow.AddMinutes(tokenVlidityMins);

            var permisos = userAccount.ObtenerPermisosActivos();

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    new Claim(JwtRegisteredClaimNames.Name, request.Username),
                    new Claim("Rol", userAccount.IdRolnav.nombre),
                    new Claim("EstadoUsuario", userAccount.estado),
                    new Claim("EstadoRol", userAccount.IdRolnav.estado),
                    new Claim("Permiso", string.Join(",", permisos))

                }),
                Expires = tokenExpiryTimeStamp,
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
                    SecurityAlgorithms.HmacSha512Signature),
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);
            var accessToken = tokenHandler.WriteToken(securityToken);

            return new LoginResponseModel
            {
                AccessToken = accessToken,
                Username = request.Username,
                ExpireIn = (int)tokenExpiryTimeStamp.Subtract(DateTime.UtcNow).TotalSeconds,
            };
        }
    }
}
