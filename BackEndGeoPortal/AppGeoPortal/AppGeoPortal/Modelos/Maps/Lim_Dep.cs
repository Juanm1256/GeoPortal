using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos.Maps
{
    [Table("limites_departamentales", Schema = "capas")]
    public class Lim_Dep
    {
        [Key]
        public int gid { get; set; }
        public double objectid { get; set; }
        public string dep { get; set; }
        public string cod_dep { get; set; }
        public decimal shape_leng { get; set; }
        public decimal shape_area { get; set; }
        public string geom { get; set; }
    }
}
