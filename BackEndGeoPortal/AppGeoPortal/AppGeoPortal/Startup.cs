using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Implementacion;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AppGeoPortal
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllersWithViews().AddNewtonsoftJson(options =>
            options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
                .AddNewtonsoftJson(options => options.SerializerSettings.ContractResolver = new DefaultContractResolver());

            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "APIBibliografia", Version = "v1" });
            });
            services.AddDbContext<AppDbContext>(options =>
                options.UseLazyLoadingProxies().UseNpgsql(
                    Configuration.GetConnectionString("cadenaconexion"),
                    x => x.UseNetTopologySuite()
                )
            );

            services.AddScoped<IUsuariosContrato, UsuariosLogic>();
            services.AddScoped<IRolesContrato, RolesLogic>();
            services.AddScoped<IRol_PermisoContrato, Rol_PermisoLogic>();
            services.AddScoped<ICap_DepContrato, Cap_DepLogic>();
            services.AddScoped<ICuencasContrato, CuencasLogic>();
            services.AddScoped<ILim_DepartContrato, Limites_DepartamentalesLogic>();
            services.AddScoped<ILim_MunContrato, Limites_MunicipalesLogic>();
            services.AddScoped<IMercadoContrato, MercadosLogic>();
            services.AddScoped<IProveedorAContrato, Proveedor_AlevinesLogic>();
            services.AddScoped<IProveedorAliContrato, Proveedor_AlimentosLogic>();
            services.AddScoped<IProveedorAsisTecContrato, Proveedor_AsistTecLogic>();
            services.AddCors(options => options.AddPolicy("AllowWebApp",
                    builder => builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader()));
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment() || env.IsProduction())
            {
                app.UseDeveloperExceptionPage();
                app.UseSwagger();
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "APIBibliografia"));
            }
            app.UseCors("AllowWebApp");

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}