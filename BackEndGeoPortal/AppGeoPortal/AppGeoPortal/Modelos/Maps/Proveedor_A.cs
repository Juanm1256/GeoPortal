using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos.Maps
{
    [Table("proveedores_alevines", Schema = "capas")]
    public class Proveedor_A
    {
        [Key]
        public int gid { get; set; }
        public string name { get; set; }
        public decimal x { get; set; }
        public decimal y { get; set; }
        public string geom { get; set; }
    }
}
