using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos
{
    [Table("personas", Schema = "public")]
    public class Personas
    {
        [Key]
        public int idpersona { get; set; }
        public string nombres { get; set; }
        public string apellidos { get; set; }
        public string ci { get; set; }
        public DateOnly fechareg { get; set; }
        public string estado { get; set; }
    }
}
