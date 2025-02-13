namespace AppGeoPortal.Middleware.Atributes
{
    [AttributeUsage(AttributeTargets.Method, AllowMultiple = false)]
    public class PermisoRequeridoAttribute : Attribute
    {
        public string Permiso { get; }

        public PermisoRequeridoAttribute(string permiso)
        {
            Permiso = permiso;
        }
    }
}
