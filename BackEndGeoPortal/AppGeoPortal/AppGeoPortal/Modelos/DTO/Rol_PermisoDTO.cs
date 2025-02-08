using System.ComponentModel.DataAnnotations;

namespace AppGeoPortal.Modelos.DTO
{
    public class Rol_PermisoDTO
    {
        [Key]
        public string nombreRol { get; set; }
        public string estado {  get; set; }
        public List<int> IdPermisos { get; set; }
    }
}
