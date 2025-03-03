export class ColoresMapaUtil {
    static readonly PALETA_VIBRANTE = [
      '#FF5722',
      '#F44336',
      '#E91E63',
      '#9C27B0',
      '#673AB7',
      '#3F51B5',
      '#2196F3',
      '#03A9F4',
      '#00BCD4',
      '#009688' 
    ];
    static readonly PALETA_PASTEL = [
      '#FFD54F',
      '#FF7043',
      '#8D6E63',
      '#66BB6A',
      '#4DB6AC',
      '#64B5F6',
      '#7986CB',
      '#BA68C8' 
    ];
    static obtenerColorAleatorio(paleta: string[] = this.PALETA_VIBRANTE): string {
      return paleta[Math.floor(Math.random() * paleta.length)];
    }
    static ajustarOpacidadColor(color: string, opacidad: number): string {
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacidad})`;
    }
  }