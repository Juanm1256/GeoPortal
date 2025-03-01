using AppGeoPortal.Modelos.Maps;

namespace AppGeoPortal.Contrato
{
    public interface IEstanquesContrato
    {
        public Task<List<Estanques>> ListarTodosPaginados(int pagina = 1, int tamañoPagina = 100);
    }
}
