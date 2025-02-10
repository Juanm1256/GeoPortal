using AppGeoPortal.Modelos.Maps;

namespace AppGeoPortal.Contrato
{
    public interface ICuencasContrato
    {
        public Task<List<Cuencas>> ListarTodos();
    }
}
