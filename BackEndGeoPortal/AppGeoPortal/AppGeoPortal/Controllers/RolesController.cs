using AppGeoPortal.Contrato;
using AppGeoPortal.Middleware.Atributes;
using AppGeoPortal.Modelos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppGeoPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {

        private readonly IRolesContrato _roles;

        public RolesController(IRolesContrato roles)
        {
            _roles = roles;
        }

        [Authorize]
        [HttpGet("ListarTodos")]
        [PermisoRequerido("Ver")]
        public async Task<ActionResult<List<Roles>>> ListarTodos()
        {
            try
            {
                var listar = await _roles.ListarTodos();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [Authorize]
        [HttpGet("ListarPermisos")]
        [PermisoRequerido("Ver")]
        public async Task<ActionResult<List<Permisos>>> ListarPermisos()
        {
            try
            {
                var listar = await _roles.ListarPermisos();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

    }
}
