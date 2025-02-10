using AppGeoPortal.Modelos.Maps;

namespace AppGeoPortal.Contrato
{
    public interface ICap_DepContrato
    {
        public Task<List<Cap_Dep>> ListarTodos();
    }
}
