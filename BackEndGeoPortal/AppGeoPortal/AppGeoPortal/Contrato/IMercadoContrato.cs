using AppGeoPortal.Modelos.Maps;

namespace AppGeoPortal.Contrato
{
    public interface IMercadoContrato
    {
        public Task<List<Mercados>> ListarTodos();
    }
}
