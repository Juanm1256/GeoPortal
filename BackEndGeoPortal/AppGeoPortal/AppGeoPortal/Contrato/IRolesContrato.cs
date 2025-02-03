using AppGeoPortal.Modelos;

namespace AppGeoPortal.Contrato
{
    public interface IRolesContrato
    {
        public Task<List<Rol>> ListarTodos();
        public Task<List<Rol>> Listaractivos();
        public Task<bool> Insertar(Rol roles);
        public Task<bool> Modificar(Rol roles, int id);
        public Task<bool> Delete(int id);
        public Task<Rol> ObtenerById(int id);
    }
}
