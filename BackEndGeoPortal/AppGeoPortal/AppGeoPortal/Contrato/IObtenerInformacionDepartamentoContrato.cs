using AppGeoPortal.Modelos.DTO;

namespace AppGeoPortal.Contrato
{
    public interface IObtenerInformacionDepartamentoContrato
    {
        public Task<List<DepartamentoInfoDTO>> ListarTodos(double longitud, double latitud);
    }
}
