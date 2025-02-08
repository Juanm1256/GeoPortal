using AppGeoPortal.Modelos;
using AppGeoPortal.Modelos.DTO;

namespace AppGeoPortal.Contrato
{
    public interface IRol_PermisoContrato
    {
        public Task<List<Rol_Permiso>> ListarTodos();
        public Task<List<Rol_Permiso>> ListarActivos();
        public Task<bool> Insertar(Rol_PermisoDTO rol_permiso);
        public Task<bool> Modificar(Rol_PermisoDTO rol_permiso, string nombrerol);
    }
}
