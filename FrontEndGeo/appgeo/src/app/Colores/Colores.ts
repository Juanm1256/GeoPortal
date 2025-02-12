export class ColoresMapaUtil {
    static readonly PALETA_VIBRANTE = [
      '#FF5722', // Deep Orange
      '#F44336', // Red
      '#E91E63', // Pink
      '#9C27B0', // Purple
      '#673AB7', // Deep Purple
      '#3F51B5', // Indigo
      '#2196F3', // Blue
      '#03A9F4', // Light Blue
      '#00BCD4', // Cyan
      '#009688'  // Teal
    ];
  
    static readonly PALETA_PASTEL = [
      '#FFD54F', // Amber
      '#FF7043', // Deep Orange
      '#8D6E63', // Brown
      '#66BB6A', // Green
      '#4DB6AC', // Teal
      '#64B5F6', // Blue
      '#7986CB', // Indigo
      '#BA68C8'  // Purple
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