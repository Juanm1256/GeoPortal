using AppGeoPortal.Modelos;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Contexto
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions options) : base(options) { }

        public virtual DbSet<Personas> Personas { get; set; }
        public virtual DbSet<Roles> Roles { get; set; }
        public virtual DbSet<Usuarios> Usuarios { get; set; }
        public virtual DbSet<Rol_Permiso> Rol_Permiso { get; set; }
        public virtual DbSet<Permisos> Permisos { get; set; }
    }
}
