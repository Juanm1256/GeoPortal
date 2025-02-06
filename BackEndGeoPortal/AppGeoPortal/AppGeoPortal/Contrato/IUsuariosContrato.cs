using AppGeoPortal.Modelos;

namespace AppGeoPortal.Contrato
{
    public interface IUsuariosContrato
    {
        public Task<List<Usuarios>> ListarTodos();
        public Task<List<Usuarios>> Listaractivos();
        public Task<bool> Insertar(Usuarios usuarios);
        public Task<bool> Modificar(Usuarios usuarios, int id);
        public Task<bool> Delete(int id);
        public Task<Usuarios> ObtenerById(int id);
    }
}
