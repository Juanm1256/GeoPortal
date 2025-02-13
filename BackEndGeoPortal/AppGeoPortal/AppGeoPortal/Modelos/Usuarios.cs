using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos
{
    [Table("usuarios", Schema = "public")]
    public class Usuarios
    {
        [Key]
        public int idusuario { get; set; }
        public int? idpersona { get; set; }
        public string username { get; set; }
        public string password_hash { get; set; }
        public int idrol { get; set; }
        public DateTime fechareg { get; set; }
        public string estado { get; set; }

        [ForeignKey("idpersona")]
        public virtual Personas IdPersonanav { get; set; }
        [ForeignKey("idrol")]
        public virtual Roles? IdRolnav { get; set; }

        public List<string> ObtenerPermisosActivos()
        {
            return IdRolnav?.RolPermisos?
                .Where(rp => rp.estado == "Activo")
                .Select(rp => rp.IdPermisonav.nombre)
                .ToList() ?? new List<string>();
        }
    }
}
