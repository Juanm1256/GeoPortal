using AppGeoPortal.Modelos;
using AppGeoPortal.Modelos.Maps;
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
        public virtual DbSet<Cap_Dep> Cap_Deps { get; set; }
        public virtual DbSet<Cuencas> Cuencas { get; set; }
        public virtual DbSet<Lim_Dep> Lim_Deps { get; set; }
        public virtual DbSet<Lim_Mun> Lim_Muns { get; set; }
        public virtual DbSet<Mercados> Mercados { get; set; }
        public virtual DbSet<Proveedor_A> ProveedorAlevies { get; set; }
        public virtual DbSet<ProveedorAli> ProveedorAlimentos { get; set; }
        public virtual DbSet<ProveedorAsisTec> ProveedorAsistenciaTecnica { get; set; }
    }
}
