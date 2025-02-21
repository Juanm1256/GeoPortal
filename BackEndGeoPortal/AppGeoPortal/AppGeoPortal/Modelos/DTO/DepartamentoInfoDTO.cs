using Microsoft.EntityFrameworkCore;

namespace AppGeoPortal.Modelos.DTO
{
    [Keyless]
    public class DepartamentoInfoDTO
    {
        public string Departamento { get; set; }
        public string ProvinciaPunto { get; set; }
        public string MunicipioPunto { get; set; }
        public string CuencaPunto { get; set; }
        public string RiosMunicipio { get; set; }
        public int NumeroMercados { get; set; }
        public int NumeroMercadosMunicipio { get; set; }
        public int NumeroProvincias { get; set; }
        public int NumeroMunicipios { get; set; }
    }
}
