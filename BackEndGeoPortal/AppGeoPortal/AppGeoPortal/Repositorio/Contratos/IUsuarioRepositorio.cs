using AppGeoPortal.Repositorio.Implementacion;

namespace AppGeoPortal.Repositorio.Contratos
{
    public interface IUsuarioRepositorio
    {
        public Task<TokenData> VerficarCredenciales(string username, string password);
        public Task<string> EncriptarPassword(string password);
        public Task<TokenData> GenerarNuevoToken(string username);
        public Task<TokenData> ConstruirToken(string username, string rol, string estadoUsuario, string estadoRol, IEnumerable<string> permisos);
    }
}
