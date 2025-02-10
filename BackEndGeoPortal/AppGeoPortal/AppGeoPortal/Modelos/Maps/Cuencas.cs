using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos.Maps
{
    [Table("cuencas", Schema = "capas")]
    public class Cuencas
    {
        [Key]
        public int gid {get; set;}
        public double sup_km2 {get; set;}
        public string cuenca {get; set;}
        public string geom { get; set;}
    }
}
