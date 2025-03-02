using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos.Maps
{
    [Table("estanques_15000", Schema = "capas_geo")]
    public class Estanques
    {
        [Key]
        public int gid { get; set; }
        public string? name { get; set; }
        public string? folderpath { get; set; }
        public string? popupinfo { get; set; }
        public decimal? shape_leng { get; set; }
        public decimal? shape_area { get; set; }
        public string? geom { get; set; }
    }
}
