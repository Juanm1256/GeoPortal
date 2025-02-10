using AppGeoPortal.Modelos.Maps;

namespace AppGeoPortal.Contrato
{
    public interface IProveedorAsisTecContrato
    {
        public Task<List<ProveedorAsisTec>> ListarTodos();
    }
}
