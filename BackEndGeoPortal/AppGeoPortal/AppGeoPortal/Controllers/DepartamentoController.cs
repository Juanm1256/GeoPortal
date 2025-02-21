using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppGeoPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartamentoController : ControllerBase
    {
        private readonly IObtenerInformacionDepartamentoContrato _departamentoService;

        public DepartamentoController(IObtenerInformacionDepartamentoContrato departamentoService)
        {
            _departamentoService = departamentoService;
        }

        [HttpGet("informacion")]
        public async Task<ActionResult<DepartamentoInfoDTO>> ObtenerInformacionDepartamento(
        [FromQuery] double longitud,
        [FromQuery] double latitud)
        {
            var resultado = await _departamentoService.ListarTodos(longitud, latitud);

            if (resultado == null)
                return NotFound();

            return Ok(resultado);
        }
    }
}
