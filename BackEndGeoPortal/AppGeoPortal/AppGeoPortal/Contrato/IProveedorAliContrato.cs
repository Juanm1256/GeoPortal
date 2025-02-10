using AppGeoPortal.Modelos.Maps;

namespace AppGeoPortal.Contrato
{
    public interface IProveedorAliContrato
    {
        public Task<List<ProveedorAli>> ListarTodos();
    }
}
