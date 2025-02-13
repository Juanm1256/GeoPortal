﻿using AppGeoPortal.Contrato;
using AppGeoPortal.Middleware.Atributes;
using AppGeoPortal.Modelos.Maps;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppGeoPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedorAlevinesController : ControllerBase
    {
        private readonly IProveedorAContrato contexto;
        public ProveedorAlevinesController(IProveedorAContrato contexto)
        {
            this.contexto = contexto;
        }

        [Authorize]
        [HttpGet("ListarTodos")]
        [PermisoRequerido("Ver")]
        public async Task<ActionResult<List<Proveedor_A>>> ListarTodos()
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
