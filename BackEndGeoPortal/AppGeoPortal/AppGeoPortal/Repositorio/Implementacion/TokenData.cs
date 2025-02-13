using AppGeoPortal.Repositorio.Contratos;

namespace AppGeoPortal.Repositorio.Implementacion
{
    public class TokenData : ITokenData
    {
        public DateTime Expira { get; set; }
        public string Token { get; set; }
    }
}
