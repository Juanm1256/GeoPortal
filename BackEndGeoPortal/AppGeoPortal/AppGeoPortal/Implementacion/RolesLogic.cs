using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos;
using AppGeoPortal.Modelos.DTO;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class RolesLogic : IRolesContrato
    {
        private readonly AppDbContext context;

        public RolesLogic(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<List<Permisos>> ListarPermisos()
        {
            var listaractivo = await context.Permisos.OrderBy(x => x.idpermiso).ToListAsync();
            return listaractivo;
        }

        public async Task<List<RolesDTO>> ListarTodos()
        {
            var roles = await context.Roles.Include(r => r.RolPermisos)
                                   .ThenInclude(rp => rp.IdPermisonav)
                                   .ToListAsync();

            var rolesConPermisos = roles.Select(r => new RolesDTO
            {
                idrol = r.idrol,
                nombre = r.nombre,
                fechareg = r.fechareg,
                estado = r.estado,
                permisos = r.RolPermisos
                    .Where(rp => rp.estado == "Activo")  // Filtramos solo los permisos activos
                    .Select(rp => rp.IdPermisonav.nombre) // Seleccionamos solo el nombre del permiso
                    .ToList()
            }).ToList();

            return rolesConPermisos;
        }

    }
}
