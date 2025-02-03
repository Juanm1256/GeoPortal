using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos
{
    [Table("rol", Schema = "public")]
    public class Rol
    {
        [Key]
        public int idrol { get; set; }
        public string nombre { get; set; }
        public DateOnly fechareg { get; set; }
        public string estado { get; set; }
    }
}
