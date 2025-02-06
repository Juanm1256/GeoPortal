using AppGeoPortal.Modelos;

namespace AppGeoPortal.Contrato
{
    public interface IRolesContrato
    {
        public Task<List<Roles>> ListarTodos();
        public Task<List<Roles>> Listaractivos();
        public Task<bool> Insertar(Roles roles);
        public Task<bool> Modificar(Roles roles, int id);
        public Task<bool> Delete(int id);
        public Task<Roles> ObtenerById(int id);
    }
}
