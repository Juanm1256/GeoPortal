namespace AppGeoPortal.Repositorio.Contratos
{
    public interface ITokenData
    {
        public DateTime Expira { get; set; }
        public string Token { get; set; }
    }
}
