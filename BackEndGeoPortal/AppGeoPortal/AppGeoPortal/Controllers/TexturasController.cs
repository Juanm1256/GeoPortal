using AppGeoPortal.Contrato;
using AppGeoPortal.Middleware.Atributes;
using AppGeoPortal.Modelos;
using AppGeoPortal.Modelos.DTO;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppGeoPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TexturasController : ControllerBase
    {
        private readonly ITexturaContrato _textura;

        public TexturasController(ITexturaContrato textura)
        {
            _textura = textura;
        }

        [Authorize(Roles = "ADMINISTRADOR, VISITANTE")]
        [HttpGet("ListarTexturasuelocero")]
        [PermisoRequerido("Ver")]
        public async Task<ActionResult<List<TexturaDTO>>> ListarTexturasuelocero()
        {
            try
            {
                var listar = await _textura.ListarTexturasuelocero();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMINISTRADOR, VISITANTE")]
        [HttpGet("ListarTexturasuelodiez")]
        [PermisoRequerido("Ver")]
        public async Task<ActionResult<List<TexturaDTO>>> ListarTexturasuelodiez()
        {
            try
            {
                var listar = await _textura.ListarTexturasuelodiez();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMINISTRADOR, VISITANTE")]
        [HttpGet("ListarTexturasuelotreinta")]
        [PermisoRequerido("Ver")]
        public async Task<ActionResult<List<TexturaDTO>>> ListarTexturasuelotreinta()
        {
            try
            {
                var listar = await _textura.ListarTexturasuelotreinta();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMINISTRADOR, VISITANTE")]
        [HttpGet("ListarTexturasuelosesenta")]
        [PermisoRequerido("Ver")]
        public async Task<ActionResult<List<TexturaDTO>>> ListarTexturasuelosesenta()
        {
            try
            {
                var listar = await _textura.ListarTexturasuelosesenta();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMINISTRADOR, VISITANTE")]
        [HttpGet("ListarTexturasuelocien")]
        [PermisoRequerido("Ver")]
        public async Task<ActionResult<List<TexturaDTO>>> ListarTexturasuelocien()
        {
            try
            {
                var listar = await _textura.ListarTexturasuelocien();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMINISTRADOR, VISITANTE")]
        [HttpGet("ListarTexturasuelodoscientos")]
        [PermisoRequerido("Ver")]
        public async Task<ActionResult<List<TexturaDTO>>> ListarTexturasuelodoscientos()
        {
            try
            {
                var listar = await _textura.ListarTexturasuelodoscientos();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMINISTRADOR, VISITANTE")]
        [HttpGet("ListarModGeneral")]
        [PermisoRequerido("Ver")]
        public async Task<ActionResult<List<ModGeneralDTO>>> ListarModGeneral()
        {
            try
            {
                var listar = await _textura.ListarModGen();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMINISTRADOR, VISITANTE")]
        [HttpGet("ListarTexturas")]
        [PermisoRequerido("Ver")]
        public async Task<ActionResult<List<ModGeneralDTO>>> ListarTexturas()
        {
            try
            {
                var listar = await _textura.ListarTexturas();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }

        [Authorize(Roles = "ADMINISTRADOR, VISITANTE")]
        [HttpGet("ListarCategoria_uso_suelo")]
        [PermisoRequerido("Ver")]
        public async Task<ActionResult<List<ModGeneralDTO>>> ListarCategoria_uso_suelo()
        {
            try
            {
                var listar = await _textura.Listarcategoria_uso();
                return Ok(listar);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Error al obtener los datos: {ex.Message}");
            }
        }
    }
}
