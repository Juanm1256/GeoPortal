using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos;
using AppGeoPortal.Modelos.DTO;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class Rol_PermisoLogic : IRol_PermisoContrato
    {
        private readonly AppDbContext context;

        public Rol_PermisoLogic(AppDbContext context)
        {
            this.context = context;
        }


        public async Task<bool> Insertar(Rol_PermisoDTO dto)
        {
            if (string.IsNullOrEmpty(dto.nombreRol) || dto.IdPermisos == null || dto.IdPermisos.Count == 0)
                return false;

            var rolExistente = await context.Roles.FirstOrDefaultAsync(r => r.nombre == dto.nombreRol);
            if (rolExistente != null)
                return false; 

            var permisosExistentes = await context.Permisos
                .Where(p => dto.IdPermisos.Contains(p.idpermiso))
                .Select(p => p.idpermiso)
                .ToListAsync();

            if (permisosExistentes.Count != dto.IdPermisos.Count)
            {
                return false;
            }

            var nuevoRol = new Roles
            {
                nombre = dto.nombreRol,
                fechareg = DateOnly.FromDateTime(DateTime.UtcNow),
                estado = dto.estado
            };
            context.Roles.Add(nuevoRol);
            await context.SaveChangesAsync();

            var nuevosRolPermisos = dto.IdPermisos.Select(idPermiso => new Rol_Permiso
            {
                idrol = nuevoRol.idrol,
                idpermiso = idPermiso,
                estado = "Activo"
            }).ToList();

            await context.Rol_Permiso.AddRangeAsync(nuevosRolPermisos);
            await context.SaveChangesAsync();

            return true;
        }


        public async Task<List<Rol_Permiso>> ListarTodos()
        {
            var listartodos = await context.Rol_Permiso
                .Include(rp => rp.IdRolnav)
                .Include(rp => rp.IdPermisonav)
                .OrderByDescending(rp => rp.idpermiso)
                .AsNoTracking()
                .ToListAsync();
            return listartodos;
        }
        
        public async Task<List<Rol_Permiso>> ListarActivos()
        {
            var listartodos = await context.Rol_Permiso
                .Include(rp => rp.IdRolnav)
                .Include(rp => rp.IdPermisonav)
                .OrderByDescending(rp => rp.idpermiso)
                .AsNoTracking()
                .Where(x=>x.estado=="Activo")
                .ToListAsync();
            return listartodos;
        }

        public async Task<bool> Modificar(Rol_PermisoDTO dto, string nombrerol)
        {
            var rolExistente = await context.Roles
                .Include(r => r.RolPermisos)
                .FirstOrDefaultAsync(r => r.nombre == nombrerol);

            if (rolExistente == null)
                return false;

            rolExistente.nombre = dto.nombreRol;
            rolExistente.estado = dto.estado;

            if (dto.estado == "Inactivo")
            {
                foreach (var permiso in rolExistente.RolPermisos)
                {
                    permiso.estado = "Inactivo";
                }
            }
            else if (dto.estado == "Activo")
            {
                foreach (var permiso in rolExistente.RolPermisos)
                {
                    if (dto.IdPermisos.Contains(permiso.idpermiso))
                    {
                        permiso.estado = "Activo";
                    }
                    else
                    {
                        permiso.estado = "Inactivo";
                    }
                }
            }

            await context.SaveChangesAsync();

            var permisosNuevos = dto.IdPermisos.Except(rolExistente.RolPermisos.Select(p => p.idpermiso)).ToList();
            foreach (var idPermiso in permisosNuevos)
            {
                var nuevoRolPermiso = new Rol_Permiso
                {
                    idrol = rolExistente.idrol,
                    idpermiso = idPermiso,
                    estado = "Activo"
                };
                context.Rol_Permiso.Add(nuevoRolPermiso);
            }

            await context.SaveChangesAsync();
            return true;
        }


    }
}
