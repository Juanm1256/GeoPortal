using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Modelos;
using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Implementacion
{
    public class UsuariosLogic : IUsuariosContrato
    {
        private readonly AppDbContext context;

        public UsuariosLogic(AppDbContext context)
        {
            this.context = context;
        }
        public async Task<bool> Delete(int id)
        {
            bool sw = false;
            Usuarios eliminar = await context.Usuarios.FirstOrDefaultAsync(x => x.idusuario == id);
            context.Usuarios.Remove(eliminar);
            await context.SaveChangesAsync();
            if (eliminar != null)
            {
                sw = true;
            }
            return sw;
        }

        public async Task<bool> Insertar(Usuarios usuarios)
        {
            bool sw = false;
            context.Usuarios.Add(usuarios);
            int response = await context.SaveChangesAsync();
            if (response == 2)
            {
                sw = true;
            }
            return sw;
        }

        public async Task<List<Usuarios>> Listaractivos()
        {
            var listaractivo = await context.Usuarios.Include(c => c.IdPersonanav).Where(x => x.estado == "Activo").OrderByDescending(x => x.idusuario).ToListAsync();
            return listaractivo;
        }

        public async Task<List<Usuarios>> ListarTodos()
        {
            var listartodos = await context.Usuarios.Include(c => c.IdPersonanav).OrderByDescending(x => x.fechareg).ToListAsync();
            return listartodos;
        }

        public async Task<bool> Modificar(Usuarios usuarios, int id)
        {
            bool sw = false;
            var modificar = await context.Usuarios
                .Include(u => u.IdPersonanav)
                .FirstOrDefaultAsync(x => x.idusuario == id);

            if (modificar != null)
            {
                modificar.idpersona = usuarios.idpersona;
                modificar.username = usuarios.username;
                modificar.password_hash = usuarios.password_hash;
                modificar.idrol = usuarios.idrol;
                modificar.estado = usuarios.estado;

                if (usuarios.IdPersonanav != null)
                {
                    modificar.IdPersonanav.nombres = usuarios.IdPersonanav.nombres;
                    modificar.IdPersonanav.apellidos = usuarios.IdPersonanav.apellidos;
                    modificar.IdPersonanav.ci = usuarios.IdPersonanav.ci;
                }

                // Guardar los cambios tanto en Usuario como en Personas
                await context.SaveChangesAsync();
                sw = true;
            }

            return sw;
        }


        public async Task<Usuarios> ObtenerById(int id)
        {
            var byid = await context.Usuarios.FirstOrDefaultAsync(x => x.idusuario == id);
            return byid;
        }
    }
}
