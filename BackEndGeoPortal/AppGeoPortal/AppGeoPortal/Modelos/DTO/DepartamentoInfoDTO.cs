using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Modelos.DTO
{
    [Keyless]
    public class DepartamentoInfoDTO
    {
        public string Departamento { get; set; } = "N/A";
        public string ProvinciaPunto { get; set; } = "N/A";
        public string MunicipioPunto { get; set; } = "N/A";
        public string CuencaPunto { get; set; } = "N/A";
        public string RiosMunicipio { get; set; } = "N/A";
        public double NumeroMercados { get; set; } = 0;
        public double NumeroMercadosMunicipio { get; set; } = 0;
        public double NumeroProvincias { get; set; } = 0;
        public double NumeroMunicipios { get; set; } = 0;

        public double porcentaje_cobertura_arborea { get; set; } = 0;
        public double porcentaje_matorral { get; set; } = 0;
        public double porcentaje_pradera { get; set; } = 0;
        public double porcentaje_tierras_cultivo { get; set; } = 0;
        public double porcentaje_construido { get; set; } = 0;
        public double porcentaje_vegetacion_desnuda { get; set; } = 0;
        public double porcentaje_nieve_hielo { get; set; } = 0;
        public double porcentaje_masas_agua { get; set; } = 0;
        public double porcentaje_humedal_herbaceo { get; set; } = 0;

        public double porcentaje_no_apta { get; set; } = 0;
        public double porcentaje_baja_idoneidad { get; set; } = 0;
        public double porcentaje_moderada_idoneidad { get; set; } = 0;
        public double porcentaje_alta_idoneidad { get; set; } = 0;

        public double valor_maximo_fragmentos { get; set; } = 0;
        public double total_pixeles_fragmentos { get; set; } = 0;

        public double porcentaje_no_dato { get; set; } = 0;
        public double porcentaje_arcilloso { get; set; } = 0;
        public double porcentaje_arcillo_arenoso { get; set; } = 0;
        public double porcentaje_franco_arcilloso { get; set; } = 0;
        public double porcentaje_franco_arcillo_arenoso { get; set; } = 0;
        public double porcentaje_franco { get; set; } = 0;
        public double porcentaje_franco_limoso { get; set; } = 0;
        public double porcentaje_franco_arenoso { get; set; } = 0;
    }
}
