using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos;
using AppGeoPortal.Modelos.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppGeoPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Rol_PermisoController : ControllerBase
    {
        private readonly IRol_PermisoContrato _roles;

        public Rol_PermisoController(IRol_PermisoContrato roles)
        {
            _roles = roles;
        }

        [Authorize(Policy = "PuedeVer")]
        [HttpGet("ListarTodos")]
        public async Task<ActionResult<List<Rol_Permiso>>> ListarTodos()
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

        [Authorize(Policy = "PuedeVer")]
        [HttpGet("ListarActivos")]
        public async Task<ActionResult<List<Rol_Permiso>>> ListarActivos()
        {
            try
            {
                var listar = await _roles.ListarActivos();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [Authorize(Policy = "PuedeAgregar")]
        [HttpPost("Insertar")]
        public async Task<ActionResult> Insertar([FromBody] Rol_PermisoDTO roles)
        {
            try
            {
                var insertar = await _roles.Insertar(roles);
                if (insertar)
                {
                    return CreatedAtAction(nameof(ListarTodos), new { id = roles.nombreRol }, roles);
                }

                return BadRequest("No se pudo insertar el rol");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al insetar el Rol: {ex.Message}");
            }
        }

        [Authorize(Policy = "PuedeModificar")]
        [HttpPut("Modificar/{nombrerol}")]
        public async Task<ActionResult> Modificar([FromBody] Rol_PermisoDTO roles, string nombrerol)
        {
            try
            {
                var modificar = await _roles.Modificar(roles, nombrerol);
                if (modificar)
                {
                    return CreatedAtAction(nameof(ListarTodos), new { id = roles.IdPermisos }, roles);
                }

                return BadRequest("No se pudo modificar el rol");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al modificar el rol: {ex.Message}");
            }
        }
    }
}
