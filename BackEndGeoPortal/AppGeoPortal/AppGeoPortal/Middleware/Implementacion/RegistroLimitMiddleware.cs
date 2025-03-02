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

                int? ObtenerIdUsuario()
                {
                    var usuarioClaim = context.User.FindFirst("idusuario");
                    return usuarioClaim != null
                        ? int.Parse(usuarioClaim.Value)
                        : (int?)null;
                }

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

                var metodoControlado = metodosControlados
                    .FirstOrDefault(m =>
                        m.Metodo == context.Request.Method &&
                        m.Rutas.Any(ruta =>
                            context.Request.Path.StartsWithSegments(ruta, StringComparison.OrdinalIgnoreCase)
                        )
                    );

                if (metodoControlado != null)
                {
                    var usuarioId = ObtenerIdUsuario();

                    if (usuarioId.HasValue)
                    {
                        int limiteSolicitudes = configuration
                            .GetSection($"RegistroSettings:LimitesPorMetodo:{metodoControlado.Metodo}")
                            .Get<int>();

                        if (limiteSolicitudes == 0)
                        {
                            limiteSolicitudes = 50;
                        }

                        TimeSpan periodoLimite;
                        if (!TimeSpan.TryParse(
                            configuration.GetValue<string>("RegistroSettings:PeriodoLimite"),
                            out periodoLimite))
                        {
                            periodoLimite = TimeSpan.FromDays(1);
                        }

                        var fechaLimite = DateTime.UtcNow.Subtract(periodoLimite);

                        var solicitudesActuales = await dbContext.RegistroSolicitudes
                            .CountAsync(u => u.idusuario == usuarioId &&
                                            u.fecha >= fechaLimite &&
                                            u.metodo == context.Request.Method);

                        logger.LogWarning($"Usuario: {usuarioId.Value}, Método: {metodoControlado.Metodo}, " +
                            $"Solicitudes Actuales: {solicitudesActuales}, Límite: {limiteSolicitudes}, " +
                            $"Periodo: {periodoLimite}, Ruta: {context.Request.Path}");

                        if (solicitudesActuales >= limiteSolicitudes)
                        {
                            logger.LogWarning($"Usuario {usuarioId.Value} excedió el límite de {metodoControlado.Metodo} en el periodo configurado");

                            context.Response.StatusCode = StatusCodes.Status429TooManyRequests;
                            await context.Response.WriteAsJsonAsync(new
                            {
                                mensaje = $"Se ha excedido el límite de solicitudes {metodoControlado.Metodo} en el periodo configurado",
                                codigoError = "REQUEST_LIMIT_EXCEEDED"
                            });
                            return;
                        }

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
                ruta = ruta.Value,
                fecha = DateTime.UtcNow
            };
            context.RegistroSolicitudes.Add(registroSolicitud);
            await context.SaveChangesAsync();
        }
    }
}