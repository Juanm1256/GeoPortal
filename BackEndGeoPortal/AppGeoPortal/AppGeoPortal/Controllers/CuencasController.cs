using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppGeoPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuencasController : ControllerBase
    {
        private readonly ICuencasContrato contexto;
        public CuencasController(ICuencasContrato contexto)
        {
            this.contexto = contexto;
        }

        [Authorize(Policy = "PuedeVer")]
        [HttpGet("ListarTodos")]
        public async Task<ActionResult<List<Cuencas>>> ListarTodos()
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
