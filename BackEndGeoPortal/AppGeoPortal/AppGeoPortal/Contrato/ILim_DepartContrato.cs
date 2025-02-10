using AppGeoPortal.Modelos.Maps;

namespace AppGeoPortal.Contrato
{
    public interface ILim_DepartContrato
    {
        public Task<List<Lim_Dep>> ListarTodos();
    }
}
