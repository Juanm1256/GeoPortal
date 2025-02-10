using AppGeoPortal.Modelos.Maps;

namespace AppGeoPortal.Contrato
{
    public interface ILim_MunContrato
    {
        public Task<List<Lim_Mun>> ListarTodos();
    }
}
