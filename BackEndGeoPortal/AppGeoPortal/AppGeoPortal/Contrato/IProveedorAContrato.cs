using AppGeoPortal.Modelos.Maps;

namespace AppGeoPortal.Contrato
{
    public interface IProveedorAContrato
    {
        public Task<List<Proveedor_A>> ListarTodos();
    }
}
