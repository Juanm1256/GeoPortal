using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos;
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
        [HttpGet("ListarTodos")]
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

        [HttpGet("ListarPermisos")]
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
