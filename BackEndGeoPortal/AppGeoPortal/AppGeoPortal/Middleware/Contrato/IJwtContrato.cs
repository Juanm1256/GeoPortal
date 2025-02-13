using AppGeoPortal.Middleware.Models;

namespace AppGeoPortal.Middleware.Contrato
{
    public interface IJwtContrato
    {
        Task<LoginResponseModel?> Authenticate(LoginRequestModel request);
    }
}
