using Xunit;
using Microsoft.EntityFrameworkCore;
using AppGeoPortal.Contexto;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Modelos;
using AppGeoPortal.Modelos.DTO;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

namespace GeoPortalImplementacionTests
{
    public class RolPermisoLogicTests
    {
        private readonly AppDbContext _context;
        private readonly Rol_PermisoLogic _rolPermisoLogic;

        public RolPermisoLogicTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_RolPermiso")
                .Options;

            _context = new AppDbContext(options);
            _rolPermisoLogic = new Rol_PermisoLogic(_context);

            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            var rol = new Roles { nombre = "Admin", estado = "Activo" };
            var permiso1 = new Permisos { nombre = "Ver" };
            var permiso2 = new Permisos { nombre = "Editar" };

            _context.Roles.Add(rol);
            _context.Permisos.AddRange(permiso1, permiso2);
            _context.SaveChanges();

            _context.Rol_Permiso.Add(new Rol_Permiso
            {
                idrol = rol.idrol,
                idpermiso = permiso1.idpermiso,
                estado = "Activo"
            });

            _context.SaveChanges();
        }

        [Fact]
        public async Task ListarTodos_ReturnsAllRolPermisos()
        {
            var result = await _rolPermisoLogic.ListarTodos();

            Assert.Single(result);
        }

        [Fact]
        public async Task ListarActivos_ReturnsOnlyActiveRolPermisos()
        {
            var result = await _rolPermisoLogic.ListarActivos();

            Assert.All(result, rp => Assert.Equal("Activo", rp.estado));
        }

        [Fact]
        public async Task Insertar_AddsNewRolPermiso()
        {
            var dto = new Rol_PermisoDTO
            {
                nombreRol = "Editor",
                estado = "Activo",
                IdPermisos = new List<int> { 1 }
            };

            int antes = (await _rolPermisoLogic.ListarTodos()).Count;

            var result = await _rolPermisoLogic.Insertar(dto);
            int despues = (await _rolPermisoLogic.ListarTodos()).Count;

            Assert.True(result);
            Assert.Equal(antes + 1, despues);
        }

        [Fact]
        public async Task Modificar_UpdatesRolPermiso()
        {
            var dto = new Rol_PermisoDTO
            {
                nombreRol = "Admin",
                estado = "Inactivo", 
                IdPermisos = new List<int>()
            };

            var result = await _rolPermisoLogic.Modificar(dto, "Admin");
            var roles = await _rolPermisoLogic.ListarTodos();

            Assert.True(result);
            Assert.All(roles, rp => Assert.Equal("Inactivo", rp.estado));
        }

    }
}