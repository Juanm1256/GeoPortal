using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.Maps;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppGeoPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class Limites_MunicipalesController : ControllerBase
    {
        private readonly ILim_MunContrato contexto;
        public Limites_MunicipalesController(ILim_MunContrato contexto)
        {
            this.contexto = contexto;
        }

        [Authorize(Policy = "PuedeVer")]
        [HttpGet("ListarTodos")]
        public async Task<ActionResult<List<Lim_Mun>>> ListarTodos()
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
