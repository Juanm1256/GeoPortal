using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos.Maps
{
    [Table("limites_municipales", Schema = "capas")]
    public class Lim_Mun
    {
        [Key]
        public int gid { get; set; }
        public double objectid { get; set; }
        public string dep { get; set; }
        public string prov {  get; set; }
        public string mun { get; set; }
        public string cod_dep { get; set; }
        public string cod_prov { get; set; }
        public string cod_mun { get; set; }
        public decimal shape_leng { get; set; }
        public decimal shape_area { get; set; }
        public string geom { get; set; }
    }
}
