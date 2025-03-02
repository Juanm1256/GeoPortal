using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos.Maps
{
    public class Mod_General
    {
        [Key]
        public int rid { get; set; }
        [NotMapped]
        public object rast { get; set; }
        public string? categoria{ get; set; }
        public double? porcentaje { get; set; }
    }
}
