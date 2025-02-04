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
        public async Task<ActionResult<List<Rol>>> ListarTodos()
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

        [HttpGet("ListarActivos")]
        public async Task<ActionResult<List<Rol>>> ListarActivos()
        {
            try
            {
                var listar = await _roles.Listaractivos();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [HttpPost("Insertar")]
        public async Task<ActionResult> Insertar([FromBody] Rol roles)
        {
            try
            {
                var insertar = await _roles.Insertar(roles);
                if (insertar)
                {
                    return CreatedAtAction(nameof(ListarTodos), new { id = roles.idrol}, roles);
                }

                return BadRequest("No se pudo insertar el rol");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al insetar el Rol: {ex.Message}");
            }
        }

        [HttpPut("Modificar/{id:int}")]
        public async Task<ActionResult> Modificar([FromBody] Rol roles, int id)
        {
            try
            {
                var modificar = await _roles.Modificar(roles, id);
                if (modificar)
                {
                    return CreatedAtAction(nameof(ListarTodos), new { id = roles.idrol }, roles);
                }

                return BadRequest("No se pudo modificar el rol");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al modificar el rol: {ex.Message}");
            }
        }

        [HttpDelete("Eliminar")]
        public async Task<ActionResult> Eliminar(int id)
        {
            try
            {
                var eliminar = await _roles.Delete(id);
                if (eliminar)
                {
                    return Ok();
                }

                return BadRequest("No se pudo eliminar el rol");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar el rol: {ex.Message}");
            }
        }


        [HttpGet("ObtenerId")]
        public async Task<ActionResult<Rol>> ObtenerId(int id)
        {
            try
            {
                var listar = await _roles.ObtenerById(id);
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }
    }
}
