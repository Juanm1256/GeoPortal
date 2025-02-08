namespace AppGeoPortal.Modelos.DTO
{
    public class RolesDTO
    {
        public int idrol { get; set; }
        public string nombre { get; set; }
        public DateOnly fechareg { get; set; }
        public string estado { get; set; }
        public List<string> permisos { get; set; }
    }
}
