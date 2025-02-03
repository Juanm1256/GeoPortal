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
        public DateOnly fechareg { get; set; }
        public string estado { get; set; }

        [ForeignKey("idpersona")]
        public virtual Personas? IdPersonanav { get; set; }
        [ForeignKey("idrol")]
        public virtual Rol? IdRolnav { get; set; }
    }
}
