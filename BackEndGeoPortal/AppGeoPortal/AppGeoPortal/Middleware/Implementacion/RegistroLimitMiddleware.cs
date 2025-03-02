using AppGeoPortal.Contexto;
using AppGeoPortal.Modelos;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace AppGeoPortal.Middleware.Implementacion
{
    public class RegistroLimitMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly IServiceScopeFactory _scopeFactory;

        public RegistroLimitMiddleware(
            RequestDelegate next,
            IServiceScopeFactory scopeFactory)
        {
            _next = next;
            _scopeFactory = scopeFactory;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
                var configuration = scope.ServiceProvider.GetRequiredService<IConfiguration>();
                var logger = scope.ServiceProvider.GetRequiredService<ILogger<RegistroLimitMiddleware>>();

                // Método para obtener ID de usuario
                int? ObtenerIdUsuario()
                {
                    var usuarioClaim = context.User.FindFirst("idusuario");
                    return usuarioClaim != null
                        ? int.Parse(usuarioClaim.Value)
                        : (int?)null;
                }

                // Lista de métodos y rutas a controlar
                var metodosControlados = new[]
                {
            new { Metodo = "GET", Rutas = new[]
            {
                "/api/Capitales_Departamentales/ListarTodos",
                "/api/Cuencas/ListarTodos",
                "/api/Departamento/ListarTodos",
                "/api/Limites_Departamentales/ListarTodos",
                "/api/Limites_Municipales/ListarTodos",
                "/api/Mercados/ListarTodos",
                "/api/ProveedorAlevines/ListarTodos",
                "/api/ProveedorAlimentos/ListarTodos",
                "/api/ProveedorAsistenciaTecnica/ListarTodos",
                "/api/Rol_Permiso/ListarTodos",
                "/api/Rol_Permiso/ListarActivos",
                "/api/Roles/ListarTodos",
                "/api/Roles/ListarPermisos",
                "/api/Texturas/ListarTexturasuelocero",
                "/api/Texturas/ListarTexturasuelodiez",
                "/api/Texturas/ListarTexturasuelotreinta",
                "/api/Texturas/ListarTexturasuelosesenta",
                "/api/Texturas/ListarTexturasuelocien",
                "/api/Texturas/ListarTexturasuelodoscientos",
                "/api/Usuarios/ListarTodos",
                "/api/Usuarios/ListarActivos",
                "/api/Usuarios/ObtenerID"
            }},
            new { Metodo = "POST", Rutas = new[]
            {
                "/api/Usuarios/Insertar",
                "/api/Rol_Permiso/Insertar"
            }},
            new { Metodo = "PUT", Rutas = new[]
            {
                "/api/Usuarios/Modificar/{id}",
                "/api/Rol_Permiso/Modificar/{nombrerol}"
            }},
            new { Metodo = "DELETE", Rutas = new[]
            {
                "/api/Usuarios/Eliminar"
            }}
        };

                // Buscar si la ruta actual está en los métodos controlados
                var metodoControlado = metodosControlados
                    .FirstOrDefault(m =>
                        m.Metodo == context.Request.Method &&
                        m.Rutas.Any(ruta =>
                            context.Request.Path.StartsWithSegments(ruta, StringComparison.OrdinalIgnoreCase)
                        )
                    );

                // Si es un método controlado
                if (metodoControlado != null)
                {
                    var usuarioId = ObtenerIdUsuario();

                    if (usuarioId.HasValue)
                    {
                        // Configuración de límites
                        var limitesConfiguracion = new Dictionary<string, int>
                {
                    { "POST", 50 },
                    { "PUT", 30 },
                    { "DELETE", 50 },
                    { "GET", 1000 }
                };

                        // Obtener límite para el método
                        int limiteDiario = limitesConfiguracion.ContainsKey(metodoControlado.Metodo)
                            ? limitesConfiguracion[metodoControlado.Metodo]
                            : 50;

                        // Intentar con un rango de fecha más amplio
                        var fechaHoyUTC = DateTime.UtcNow.Date;
                        var fechaMañanaUTC = fechaHoyUTC.AddDays(1);

                        var solicitudesActuales = await dbContext.RegistroSolicitudes
                            .CountAsync(u => u.idusuario == usuarioId &&
                                             u.fecha >= fechaHoyUTC &&
                                             u.fecha < fechaMañanaUTC &&
                                             u.metodo == context.Request.Method);
                        // Logging detallado
                        logger.LogWarning($"Usuario: {usuarioId.Value}, Método: {metodoControlado.Metodo}, " +
                            $"Solicitudes Actuales: {solicitudesActuales}, Límite: {limiteDiario}, " +
                            $"Ruta: {context.Request.Path}");

                        // Si ya se alcanzó el límite, bloquear
                        if (solicitudesActuales >= limiteDiario)
                        {
                            logger.LogWarning($"Usuario {usuarioId.Value} excedió el límite diario de {metodoControlado.Metodo}");

                            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                            await context.Response.WriteAsJsonAsync(new
                            {
                                mensaje = $"Se ha excedido el límite diario de solicitudes {metodoControlado.Metodo}",
                                codigoError = "REQUEST_LIMIT_EXCEEDED"
                            });
                            return;
                        }

                        // Si no excede el límite, registrar la solicitud
                        await RegistrarSolicitud(dbContext, usuarioId.Value, metodoControlado.Metodo, context.Request.Path);
                    }
                }
            }

            await _next(context);
        }

        private async Task RegistrarSolicitud(
    AppDbContext context,
    int usuarioId,
    string metodo,
    PathString ruta)
        {
            var registroSolicitud = new RegistroSolicitudes
            {
                idusuario = usuarioId,
                metodo = metodo,
                ruta = ruta.Value, // Convertir PathString a string
                fecha = DateTime.UtcNow // Usar UTC y solo la parte de la fecha
            };
            context.RegistroSolicitudes.Add(registroSolicitud);
            await context.SaveChangesAsync();
        }

    }
}