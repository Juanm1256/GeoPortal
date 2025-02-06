using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppGeoPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly IUsuariosContrato _usuario;

        public UsuariosController(IUsuariosContrato usuario)
        {
            _usuario = usuario;
        }

        [HttpGet("ListarTodos")]
        public async Task<ActionResult<List<Usuarios>>> ListarTodos()
        {
            try
            {
                var listar = await _usuario.ListarTodos();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [HttpGet("ListarActivos")]
        public async Task<ActionResult<List<Usuarios>>> ListarActivos()
        {
            try
            {
                var listar = await _usuario.Listaractivos();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [HttpPost("Insertar")]
        public async Task<ActionResult> Insertar([FromBody] Usuarios usuarios)
        {
            try
            {
                var insertar = await _usuario.Insertar(usuarios);
                if (insertar)
                {
                    return CreatedAtAction(nameof(ListarTodos), new { id = usuarios.idusuario }, usuarios);
                }

                return BadRequest("No se pudo insertar el usuario");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al insetar el usuario: {ex.Message}");
            }
        }

        [HttpPut("Modificar/{id:int}")]
        public async Task<ActionResult> Modificar([FromBody] Usuarios usuarios, int id)
        {
            try
            {
                var modificar = await _usuario.Modificar(usuarios, id);
                if (modificar)
                {
                    return CreatedAtAction(nameof(ListarTodos), new { id = usuarios.idusuario }, usuarios);
                }

                return BadRequest("No se pudo modificar el usuario");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al modificar el usuario: {ex.Message}");
            }
        }

        [HttpDelete("Eliminar")]
        public async Task<ActionResult> Eliminar(int id)
        {
            try
            {
                var eliminar = await _usuario.Delete(id);
                if (eliminar)
                {
                    return Ok();
                }

                return BadRequest("No se pudo eliminar el usuario");

            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al eliminar el usuario: {ex.Message}");
            }
        }


        [HttpGet("ObtenerId")]
        public async Task<ActionResult<Usuarios>> ObtenerId(int id)
        {
            try
            {
                var listar = await _usuario.ObtenerById(id);
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }
    }
}
