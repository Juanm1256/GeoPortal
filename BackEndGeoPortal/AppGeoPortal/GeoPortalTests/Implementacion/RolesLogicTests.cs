using Xunit;
using Microsoft.EntityFrameworkCore;
using AppGeoPortal.Contexto;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Modelos;
using AppGeoPortal.Modelos.DTO;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GeoPortalImplementacionTests
{
    public class RolesLogicTests
    {
        private readonly AppDbContext _context;
        private readonly RolesLogic _rolesLogic;

        public RolesLogicTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: "TestDB_Roles")
                .Options;

            _context = new AppDbContext(options);
            _rolesLogic = new RolesLogic(_context);

            // **Insertar datos en la BD en memoria asegurando que no se repitan**
            InicializarBaseDeDatos().Wait();
        }

        private async Task InicializarBaseDeDatos()
        {
            if (_context.Roles.Any() || _context.Permisos.Any() || _context.Rol_Permiso.Any())
                return; // Evitar duplicaciones al correr varias pruebas

            // **Insertar Permisos**
            var permiso1 = new Permisos { idpermiso = 1, nombre = "Ver" };
            var permiso2 = new Permisos { idpermiso = 2, nombre = "Editar" };

            _context.Permisos.AddRange(permiso1, permiso2);
            await _context.SaveChangesAsync(); // 💾 Guardar antes de usar en referencias

            // **Insertar Roles**
            var rol1 = new Roles { idrol = 1, nombre = "Admin", estado = "Activo" };
            var rol2 = new Roles { idrol = 2, nombre = "Usuario", estado = "Activo" };

            _context.Roles.AddRange(rol1, rol2);
            await _context.SaveChangesAsync(); // 💾 Guardar antes de crear relaciones

            // **Insertar Relaciones en Rol_Permiso**
            _context.Rol_Permiso.AddRange(new List<Rol_Permiso>
        {
            new Rol_Permiso { idrol = rol1.idrol, idpermiso = permiso1.idpermiso, estado = "Activo" },
            new Rol_Permiso { idrol = rol1.idrol, idpermiso = permiso2.idpermiso, estado = "Activo" },
            new Rol_Permiso { idrol = rol2.idrol, idpermiso = permiso1.idpermiso, estado = "Activo" }
        });

            await _context.SaveChangesAsync(); // 💾 Guardar todo en la BD en memoria
        }

        [Fact]
        public async Task ListarTodos_ReturnsAllRolesWithPermissions()
        {
            // Act
            var result = await _rolesLogic.ListarTodos();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, r => r.nombre == "Admin" && r.permisos.Contains("Ver"));
            Assert.Contains(result, r => r.nombre == "Usuario" && r.permisos.Contains("Ver"));
        }

        [Fact]
        public async Task ListarPermisos_ReturnsAllPermisos()
        {
            // Act
            var result = await _rolesLogic.ListarPermisos();

            // Assert
            Assert.NotNull(result);
            Assert.Equal(2, result.Count);
            Assert.Contains(result, p => p.nombre == "Ver");
            Assert.Contains(result, p => p.nombre == "Editar");
        }
    }
}
