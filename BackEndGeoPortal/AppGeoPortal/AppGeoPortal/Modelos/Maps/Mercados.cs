using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos.Maps
{
    [Table("mercados_project", Schema = "capas")]
    public class Mercados
    {
        [Key]
        public int gid { get; set; }
        public double ogc_fid { get; set; }
        public string departamen { get; set; }
        public string provincia { get; set; }
        public string municipio { get; set; }
        public string ciudad { get; set; }
        public string nombre { get; set; }
        public string geom { get; set; }
    }
}
