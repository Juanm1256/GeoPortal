using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AppGeoPortal.Contexto;
using AppGeoPortal.Middleware;
using AppGeoPortal.Repositorio.Contratos;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;

namespace AppGeoPortal.Repositorio.Implementacion
{
    public class UsuarioRepositorio : IUsuarioRepositorio
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;
        private readonly ILogger<UsuarioRepositorio> _logger;
        public UsuarioRepositorio(AppDbContext context, IConfiguration configuration, ILogger<UsuarioRepositorio> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        public async Task<TokenData> VerficarCredenciales(string username, string password)
        {
            if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(password))
            {
                throw new UnauthorizedAccessException("Credenciales inválidas.");
            }

            var userAccount = await _context.Usuarios
                .Include(u => u.IdRolnav)
                .ThenInclude(r => r.RolPermisos)
                .ThenInclude(rp => rp.IdPermisonav)
                .FirstOrDefaultAsync(x => x.username == username);

            if (userAccount is null || !PasswordHashHandler.VerifyPassword(password, userAccount.password_hash))
            {
                return null;
            }

            if (userAccount.estado != "Activo")
            {
                _logger.LogWarning($"Intento de acceso de usuario inactivo: {username}");
                return null;
            }

            if (userAccount.IdRolnav.estado != "Activo")
            {
                _logger.LogWarning($"Intento de acceso con rol inactivo. Usuario: {username}, Rol: {userAccount.IdRolnav.nombre}");
                return null;
            }

            var permisos = userAccount.ObtenerPermisosActivos() ?? new List<string>();

            return await ConstruirToken(username, userAccount.IdRolnav.nombre, userAccount.estado, userAccount.IdRolnav.estado, permisos);
        }
        

        public async Task<string> EncriptarPassword(string password)
        {
            return await Task.Run(() => PasswordHashHandler.HashPassword(password));
        }

        public async Task<TokenData> GenerarNuevoToken(string username)
        {
            var userAccount = await _context.Usuarios
                .Include(u => u.IdRolnav)
                .ThenInclude(r => r.RolPermisos)
                .ThenInclude(rp => rp.IdPermisonav)
                .FirstOrDefaultAsync(x => x.username == username);

            if (userAccount is null)
            {
                return null;
            }

            if (userAccount.estado != "Activo")
            {
                _logger.LogWarning($"Intento de renovación de token de usuario inactivo: {username}");
                return null;
            }

            if (userAccount.IdRolnav.estado != "Activo")
            {
                _logger.LogWarning($"Intento de renovación de token con rol inactivo. Usuario: {username}, Rol: {userAccount.IdRolnav.nombre}");
                return null;
            }

            var permisos = userAccount.ObtenerPermisosActivos() ?? new List<string>();

            return await ConstruirToken(username, userAccount.IdRolnav.nombre, userAccount.estado, userAccount.IdRolnav.estado, permisos);
        }

        public async Task<TokenData> ConstruirToken(string username, string rol, string estadoUsuario, string estadoRol, IEnumerable<string> permisos)
        {
            var issuer = _configuration["JwtConfig:Issuer"];
            var audience = _configuration["JwtConfig:Audience"];
            var key = _configuration["JwtConfig:Key"];
            var tokenValidityMins = _configuration.GetValue<int>("JwtConfig:TokenValidityMins");
            var tokenExpiryTimeStamp = DateTime.UtcNow.AddMinutes(tokenValidityMins);

            var claims = new List<Claim>
    {
        new Claim(JwtRegisteredClaimNames.Name, username),
        new Claim("Rol", rol),
        new Claim("EstadoUsuario", estadoUsuario),
        new Claim("EstadoRol", estadoRol)
    };

            foreach (var permiso in permisos)
            {
                claims.Add(new Claim("Permiso", permiso));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = tokenExpiryTimeStamp,
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(Encoding.ASCII.GetBytes(key)),
                    SecurityAlgorithms.HmacSha512Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var securityToken = tokenHandler.CreateToken(tokenDescriptor);

            return new TokenData
            {
                Token = tokenHandler.WriteToken(securityToken),
                Expira = tokenExpiryTimeStamp
            };
        }
    }
}
