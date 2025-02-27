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

            // Asegurar que la base de datos está limpia antes de cada prueba
            _context.Database.EnsureDeleted();
            _context.Database.EnsureCreated();

            // Insertar datos de prueba en la base de datos en memoria
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
            // Act
            var result = await _usuariosLogic.ListarTodos();

            // Assert
            Assert.Equal(2, result.Count);
        }

        [Fact]
        public async Task ListarActivos_ReturnsOnlyActiveUsuarios()
        {
            // Act
            var result = await _usuariosLogic.Listaractivos();

            // Assert
            Assert.Single(result);
            Assert.Equal("user1", result.First().username);
        }

        [Fact]
        public async Task ObtenerById_ReturnsUsuario()
        {
            // Act
            var result = await _usuariosLogic.ObtenerById(1);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("user1", result.username);
        }
        [Fact]
        public async Task Insertar_AddsNewUsuario()
        {
            // Arrange
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
                    estado = "Activo" // ✅ Asegurar que tiene un estado válido
                }
            };

            // Act
            var result = await _usuariosLogic.Insertar(nuevoUsuario);

            // Buscar los datos insertados
            var usuarioEnDb = await _context.Usuarios
                .Include(u => u.IdPersonanav) // Incluir la relación con Personas
                .FirstOrDefaultAsync(u => u.username == "newUser");

            // Assert
            Assert.True(result); // La lógica debe devolver true
            Assert.NotNull(usuarioEnDb); // El usuario debe existir en la BD
            Assert.Equal("newUser", usuarioEnDb.username); // Debe coincidir el username
            Assert.NotNull(usuarioEnDb.IdPersonanav); // Debe haberse insertado la persona asociada
            Assert.Equal("Juan", usuarioEnDb.IdPersonanav.nombres); // Verificar los datos de la persona
        }

        [Fact]
        public async Task Modificar_UpdatesUsuario()
        {
            // Arrange
            var usuarioModificado = new Usuarios
            {
                idusuario = 1,
                username = "updatedUser",
                password_hash = PasswordHashHandler.HashPassword("newPassword"),
                estado = "Activo"
            };

            // Act
            var result = await _usuariosLogic.Modificar(usuarioModificado, 1);
            var usuarioEnDb = await _usuariosLogic.ObtenerById(1);

            // Assert
            Assert.True(result);
            Assert.Equal("updatedUser", usuarioEnDb.username);
        }

        [Fact]
        public async Task Eliminar_RemovesUsuario()
        {
            // Arrange: Crear un usuario adicional en la base de datos
            var usuario = new Usuarios
            {
                username = "testuser",
                password_hash = PasswordHashHandler.HashPassword("password123"),
                idrol = 1,
                estado = "Activo"
            };

            _context.Usuarios.Add(usuario);
            await _context.SaveChangesAsync();

            // Obtener el ID generado
            var usuarioEnDb = await _context.Usuarios.FirstOrDefaultAsync(u => u.username == "testuser");

            // Act: Intentamos eliminarlo
            var result = await _usuariosLogic.Delete(usuarioEnDb.idusuario);

            // Assert: Se verifica que fue eliminado
            var usuarioEliminado = await _context.Usuarios.FindAsync(usuarioEnDb.idusuario);
            Assert.True(result);
            Assert.Null(usuarioEliminado);
        }
    }
}