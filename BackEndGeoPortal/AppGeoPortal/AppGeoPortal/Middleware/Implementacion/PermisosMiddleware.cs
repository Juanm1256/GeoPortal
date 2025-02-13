using AppGeoPortal.Middleware.Atributes;

namespace AppGeoPortal.Middleware.Implementacion
{
    public class PermisosMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<PermisosMiddleware> _logger;

        public PermisosMiddleware(RequestDelegate next, ILogger<PermisosMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            var endpoint = context.GetEndpoint();
            if (endpoint == null)
            {
                await _next(context);
                return;
            }

            var permisoRequerido = endpoint.Metadata.GetMetadata<PermisoRequeridoAttribute>();
            if (permisoRequerido == null)
            {
                await _next(context);
                return;
            }

            var user = context.User;
            if (!user.Identity.IsAuthenticated)
            {
                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsync("Usuario no autenticado.");
                return;
            }

            var permisos = user.Claims
                .Where(c => c.Type == "Permiso")
                .Select(c => c.Value)
                .ToList();

            if (!permisos.Contains(permisoRequerido.Permiso))
            {
                _logger.LogWarning($"Acceso denegado. Usuario: {user.Identity.Name}, Permiso requerido: {permisoRequerido.Permiso}");
                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsync("No tienes permisos para acceder a este recurso.");
                return;
            }

            await _next(context);
        }
    }
}
