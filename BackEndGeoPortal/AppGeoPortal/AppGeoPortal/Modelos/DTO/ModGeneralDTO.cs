using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Modelos.DTO
{
    [Keyless]
    public class ModGeneralDTO
    {
        public string? categoria { get; set; }
        public double? porcentaje { get; set; }
    }
}
