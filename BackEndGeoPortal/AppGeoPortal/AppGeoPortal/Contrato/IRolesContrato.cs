using AppGeoPortal.Modelos;
using AppGeoPortal.Modelos.DTO;

namespace AppGeoPortal.Contrato
{
    public interface IRolesContrato
    {
        public Task<List<RolesDTO>> ListarTodos();
        public Task<List<Permisos>> ListarPermisos();
    }
}
