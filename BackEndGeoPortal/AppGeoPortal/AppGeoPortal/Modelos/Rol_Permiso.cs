using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos
{
    [Table("rol_permiso", Schema = "public")]
    public class Rol_Permiso
    {
        public int idropermiso { get; set; }
        public int idrol { get; set; }
        public int idpermiso { get; set; }

        [ForeignKey("idrol")]
        public virtual Roles IdRolnav { get; set; }
        [ForeignKey("idpermiso")]
        public virtual Permisos? IdPermisonav { get; set; }
    }
}
