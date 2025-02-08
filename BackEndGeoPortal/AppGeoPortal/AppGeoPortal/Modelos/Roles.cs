using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace AppGeoPortal.Modelos
{
    [Table("roles", Schema = "public")]
    public class Roles
    {
        [Key]
        public int idrol { get; set; }
        public string nombre { get; set; }
        public DateOnly fechareg { get; set; }
        public string estado { get; set; }

        public virtual ICollection<Rol_Permiso> RolPermisos { get; set; } = new List<Rol_Permiso>();

    }
}
