using AppGeoPortal.Middleware.Models;
using AppGeoPortal.Repositorio.Contratos;
using AppGeoPortal.Repositorio.Implementacion;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppGeoPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IUsuarioRepositorio usuarioRepositorio;

        public AuthController(IUsuarioRepositorio usuarioRepositorio)
        {
            this.usuarioRepositorio = usuarioRepositorio;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequestModel loginRequest)
        {
            if (loginRequest == null || string.IsNullOrWhiteSpace(loginRequest.Username))
            {
                return BadRequest(new { mensaje = "El usuario es requerido." });
            }

            if (loginRequest.RefrescarToken)
            {
                var tokenData = await usuarioRepositorio.GenerarNuevoToken(loginRequest.Username);
                if (tokenData == null)
                {
                    return Unauthorized(new { mensaje = "No se pudo renovar el token." });
                }
                return Ok(tokenData);
            }

            if (string.IsNullOrWhiteSpace(loginRequest.Password))
            {
                return BadRequest(new { mensaje = "La contraseña es requerida." });
            }

            var token = await usuarioRepositorio.VerficarCredenciales(loginRequest.Username, loginRequest.Password);

            if (token == null)
            {
                return Unauthorized(new { mensaje = "Credenciales incorrectas o usuario inactivo." });
            }

            return Ok(token);
        }
    }
}
