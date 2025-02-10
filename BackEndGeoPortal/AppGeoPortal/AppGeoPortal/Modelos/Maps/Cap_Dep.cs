using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos.Maps
{
    [Table("capitales_departamentales", Schema = "capas")]
    public class Cap_Dep
    {
        [Key]
        public int gid { get; set; }
        public double objectid { get; set; }
        public string cap_dep { get; set; }
        public string cod_ine { get; set; }
        public string geom { get; set; }
    }
}
