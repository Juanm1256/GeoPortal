using Xunit;
using Microsoft.EntityFrameworkCore;
using AppGeoPortal.Contexto;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Modelos;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using AppGeoPortal.Middleware;
using Microsoft.EntityFrameworkCore.Diagnostics;

namespace GeoPortalImplementacionTests
{
    public class UsuariosLogicTests
    {
        private readonly AppDbContext _context;
        private readonly UsuariosLogic _usuariosLogic;

        public UsuariosLogicTests()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
         .UseInMemoryDatabase(databaseName: "TestDB")
         .ConfigureWarnings(w => w.Ignore(InMemoryEventId.TransactionIgnoredWarning))
         .Options;


            _context = new AppDbContext(options);
            _usuariosLogic = new UsuariosLogic(_context);

            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            _context.Usuarios.AddRange(new List<Usuarios>
        {
            new Usuarios
            {
                idusuario = 1,
                username = "user1",
                password_hash = PasswordHashHandler.HashPassword("password1"),
                estado = "Activo"
            },
            new Usuarios
            {
                idusuario = 2,
                username = "user2",
                password_hash = PasswordHashHandler.HashPassword("password2"),
                estado = "Inactivo"
            }
        });

            _context.SaveChanges();
        }

        [Fact]
        public async Task ListarTodos_ReturnsAllUsuarios()
        {
            var result = await _usuariosLogic.ListarTodos();

            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task ListarActivos_ReturnsOnlyActiveUsuarios()
        {
            var result = await _usuariosLogic.Listaractivos();

            Assert.Single(result);
            Assert.Equal("user1", result.First().username);
        }

        [Fact]
        public async Task ObtenerById_ReturnsUsuario()
        {
            var result = await _usuariosLogic.ObtenerById(1);

            Assert.NotNull(result);
            Assert.Equal("user1", result.username);
        }
        [Fact]
        public async Task Insertar_AddsNewUsuario()
        {
            var nuevoUsuario = new Usuarios
            {
                idusuario = 3,
                username = "newUser",
                password_hash = PasswordHashHandler.HashPassword("password3"),
                estado = "Activo",
                IdPersonanav = new Personas
                {
                    idpersona = 3,
                    nombres = "Juan",
                    apellidos = "Pérez",
                    ci = "12345678",
                    estado = "Activo"
                }
            };

            var result = await _usuariosLogic.Insertar(nuevoUsuario);

            var usuarioEnDb = await _context.Usuarios
                .Include(u => u.IdPersonanav) 
                .FirstOrDefaultAsync(u => u.username == "newUser");

            Assert.True(result); 
            Assert.NotNull(usuarioEnDb);
            Assert.Equal("newUser", usuarioEnDb.username);
            Assert.NotNull(usuarioEnDb.IdPersonanav);
            Assert.Equal("Juan", usuarioEnDb.IdPersonanav.nombres);
        }

        [Fact]
        public async Task Modificar_UpdatesUsuario()
        {
            var usuarioModificado = new Usuarios
            {
                idusuario = 1,
                username = "updatedUser",
                password_hash = PasswordHashHandler.HashPassword("newPassword"),
                estado = "Activo"
            };

            var result = await _usuariosLogic.Modificar(usuarioModificado, 1);
            var usuarioEnDb = await _usuariosLogic.ObtenerById(1);

            Assert.True(result);
            Assert.Equal("updatedUser", usuarioEnDb.username);
        }

        [Fact]
        public async Task Eliminar_RemovesUsuario()
        {
            var usuario = new Usuarios
            {
                username = "testuser",
                password_hash = PasswordHashHandler.HashPassword("password123"),
                idrol = 1,
                estado = "Activo"
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            var usuarioEnDb = await _context.Usuarios.FirstOrDefaultAsync(u => u.username == "testuser");

            var result = await _usuariosLogic.Delete(usuarioEnDb.idusuario);

            var usuarioEliminado = await _context.Usuarios.FindAsync(usuarioEnDb.idusuario);
            Assert.True(result);
            Assert.Null(usuarioEliminado);
        }
    }
}