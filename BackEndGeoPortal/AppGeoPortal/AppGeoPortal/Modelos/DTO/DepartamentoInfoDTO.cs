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
        public int NumeroMercados { get; set; } = 0;
        public int NumeroMercadosMunicipio { get; set; } = 0;
        public int NumeroProvincias { get; set; } = 0;
        public int NumeroMunicipios { get; set; } = 0;
    }
}
