using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos.Maps
{
    [Table("proveedores_asistencia_tecnica", Schema = "capas")]
    public class ProveedorAsisTec
    {
        [Key]
        public int gid {  get; set; }
        public string name { get; set; }
        public decimal long_x { get; set; }
        public decimal lat_y { get; set; }
        public string geom { get; set; }
    }
}
