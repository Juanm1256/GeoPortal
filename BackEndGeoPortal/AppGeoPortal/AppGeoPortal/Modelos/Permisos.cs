using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos
{
    [Table("permisos", Schema = "public")]
    public class Permisos
    {
        [Key]
        public int idpermiso { get; set; }
        public string nombre { get; set; }
    }
}
