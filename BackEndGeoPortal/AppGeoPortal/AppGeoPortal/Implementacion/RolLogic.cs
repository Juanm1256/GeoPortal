using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class RolLogic : IRolesContrato
    {
        private readonly AppDbContext context;

        public RolLogic(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<bool> Delete(int id)
        {
            bool sw = false;
            Rol eliminar = await context.Rol.FirstOrDefaultAsync(x => x.idrol== id);
            context.Rol.Remove(eliminar);
            await context.SaveChangesAsync();
            if (eliminar != null)
            {
                sw = true;
            }
            return sw;
        }

        public async Task<bool> Insertar(Rol roles)
        {
            bool sw = false;
            context.Rol.Add(roles);
            int response = await context.SaveChangesAsync();
            if (response == 1)
            {
                sw = true;
            }
            return sw;
        }

        public async Task<List<Rol>> Listaractivos()
        {
            var listaractivo = await context.Rol.Where(x => x.estado == "Activo").OrderByDescending(x => x.idrol).ToListAsync();
            return listaractivo;
        }

        public async Task<List<Rol>> ListarTodos()
        {
            var listartodos = await context.Rol.OrderByDescending(x => x.fechareg).ToListAsync();
            return listartodos;
        }

        public async Task<bool> Modificar(Rol roles, int id)
        {
            bool sw = false;
            Rol modificar = await context.Rol.FirstOrDefaultAsync(x => x.idrol == id);
            if (modificar != null)
            {
                modificar.nombre = roles.nombre;
                modificar.estado = roles.estado;

                await context.SaveChangesAsync();
                sw = true;
            }
            return sw;
        }

        public async Task<Rol> ObtenerById(int id)
        {
            var byid = await context.Rol.FirstOrDefaultAsync(x => x.idrol == id);
            return byid;
        }
    }
}
