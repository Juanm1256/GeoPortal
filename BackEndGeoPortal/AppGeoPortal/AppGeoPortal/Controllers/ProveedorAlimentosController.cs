using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppGeoPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedorAlimentosController : ControllerBase
    {
        private readonly IProveedorAliContrato contexto;
        public ProveedorAlimentosController(IProveedorAliContrato contexto)
        {
            this.contexto = contexto;
        }

        [HttpGet("ListarTodos")]
        public async Task<ActionResult<List<ProveedorAli>>> ListarTodos()
        {
            try
            {
                var listar = await contexto.ListarTodos();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }
    }
}
