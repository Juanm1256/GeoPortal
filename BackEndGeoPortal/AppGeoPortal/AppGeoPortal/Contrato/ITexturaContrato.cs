using AppGeoPortal.Modelos.DTO;
using AppGeoPortal.Modelos.Maps;

namespace AppGeoPortal.Contrato
{
    public interface ITexturaContrato
    {
        public Task<List<TexturaDTO>> ListarTexturasuelocero();
        public Task<List<TexturaDTO>> ListarTexturasuelodiez();
        public Task<List<TexturaDTO>> ListarTexturasuelotreinta();
        public Task<List<TexturaDTO>> ListarTexturasuelosesenta();
        public Task<List<TexturaDTO>> ListarTexturasuelocien();
        public Task<List<TexturaDTO>> ListarTexturasuelodoscientos();
        public Task<List<ModGeneralDTO>> ListarModGen();
        public Task<List<ModGeneralDTO>> ListarTexturas();
        public Task<List<ModGeneralDTO>> Listarcategoria_uso();
    }
}
