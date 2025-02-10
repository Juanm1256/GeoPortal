using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos.Maps
{
    [Table("proveedores_alimentos", Schema = "capas")]
    public class ProveedorAli
    {
        [Key]
        public int gid { get; set; }
        public double oid_ { get; set; }
        public string name { get; set; }
        public string geom { get; set; }
    }
}
