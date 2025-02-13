using AppGeoPortal.Middleware.Contrato;
using AppGeoPortal.Middleware.Implementacion;
using AppGeoPortal.Middleware.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace AppGeoPortal.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IJwtContrato jwtServices;

        public AuthController(IJwtContrato jwtServices)
        {
            this.jwtServices = jwtServices;
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult<LoginResponseModel>> Login(LoginRequestModel request)
        {
            var result = await jwtServices.Authenticate(request);
            if (result is null)
            {
                return Unauthorized();
            }
            return result;
        }
    }
}
