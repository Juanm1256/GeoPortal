using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AppGeoPortal.Modelos.Maps
{
    public class Textura
    {
        [Key]
        public int rid { get; set; }
        [NotMapped]
        public object rast { get; set; }
        public double? Value { get; set; }
        public int? Count { get; set; }
        public double? Porcentaje { get; set; }
    }
}
