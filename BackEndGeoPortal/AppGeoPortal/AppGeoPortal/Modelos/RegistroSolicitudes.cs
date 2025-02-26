using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos
{
    [Table("registro_solicitudes", Schema = "public")]
    public class RegistroSolicitudes
    {
        [Key]
        public int idregistro { get; set; }
        public int idusuario { get; set; }
        public string metodo { get; set; }
        public DateTime fecha { get; set; }
        public string ruta { get; set; }
    }
}
