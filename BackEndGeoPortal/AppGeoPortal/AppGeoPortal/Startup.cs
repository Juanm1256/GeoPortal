using AppGeoPortal.Contexto;
using AppGeoPortal.Contrato;
using AppGeoPortal.Implementacion;
using AppGeoPortal.Middleware.Implementacion;
using AppGeoPortal.Repositorio.Contratos;
using AppGeoPortal.Repositorio.Implementacion;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Newtonsoft.Json.Serialization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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

            //services.AddSwaggerGen(c =>
            //{
            //    c.SwaggerDoc("v1", new OpenApiInfo { Title = "APIBibliografia", Version = "v1" });
            //    var jwtSecurityScheme = new OpenApiSecurityScheme
            //    {
            //        BearerFormat = "JWT",
            //        Name = "Authorization",
            //        In = ParameterLocation.Header,
            //        Type = SecuritySchemeType.Http,
            //        Scheme = JwtBearerDefaults.AuthenticationScheme,
            //        Description = "Enter your JWT Access Token",
            //        Reference = new OpenApiReference
            //        {
            //            Id = JwtBearerDefaults.AuthenticationScheme,
            //            Type = ReferenceType.SecurityScheme
            //        }
            //    };

            //    c.AddSecurityDefinition("Bearer", jwtSecurityScheme);
            //    c.AddSecurityRequirement(new OpenApiSecurityRequirement
            //    {
            //        { jwtSecurityScheme, new string[] { "Bearer" } }
            //    });
            //});
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
            services.AddScoped<IUsuarioRepositorio, UsuarioRepositorio>();
            services.AddCors(options => options.AddPolicy("AllowWebApp",
                    builder => builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader()));

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            }).AddJwtBearer(options =>
            {
                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = Configuration["JwtConfig:Issuer"],
                    ValidAudience = Configuration["JwtConfig:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["JwtConfig:Key"]!)),
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true
                };
            });

            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            app.UseMiddleware<JwtMiddleware>();

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                //app.UseSwagger();
                //app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "AppGeoPortal API"));
            }

            app.UseCors("AllowWebApp");

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization(); 

            app.UseMiddleware<PermisosMiddleware>(); 

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }

    }
}