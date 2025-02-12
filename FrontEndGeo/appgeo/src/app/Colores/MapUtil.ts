class MapUtil {
    static validateGeoJSON(geojson: any): boolean {
      if (!geojson || !geojson.type || !geojson.coordinates) {
        return false;
      }
      
      if (geojson.type !== 'MultiPolygon' && geojson.type !== 'Polygon') {
        return false;
      }
      
      return true;
    }
  
    static transformCoordinates(coords: number[]): number[] {
      // Ajusta estos valores según la diferencia que observes
      const offsetLat = 0;
      const offsetLng = 0;
      return [coords[0] + offsetLng, coords[1] + offsetLat];
    }
  }